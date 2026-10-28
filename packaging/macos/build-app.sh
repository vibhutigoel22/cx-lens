#!/usr/bin/env bash
# Builds "Coralogix Lens.app" and Coralogix-Lens-<version>.dmg from an already-built repo
# (run `npm ci && npm run build` first). Used by .github/workflows/build-dmg.yml and runnable on any Mac:
#
#   bash packaging/macos/build-app.sh
#
# Environment (all optional):
#   VERSION               Version shown in the app and DMG name (default: package.json version)
#   NODE_RUNTIME_VERSION  Node.js release bundled inside the app (default below)
#   BUILD_SUFFIX          Extra tag for the DMG file name, e.g. a commit hash (default: none)
#   OUT_DIR               Output folder (default: dist-mac)
#   SIGN_IDENTITY         "Developer ID Application: Name (TEAMID)". Without it the app is ad-hoc signed.
#   NOTARIZE=1            Notarize and staple the DMG (needs SIGN_IDENTITY, APPLE_ID, APPLE_APP_PASSWORD, APPLE_TEAM_ID)
#   SKIP_DMG=1            Stop after building and testing the .app
#   SMOKE_NODE            Node binary for the smoke test (default: the bundled runtime for this Mac)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HERE="$ROOT/packaging/macos"
cd "$ROOT"

APP_NAME="Coralogix Lens"
VERSION="${VERSION:-$(node -p "require('./package.json').version")}"
NODE_RUNTIME_VERSION="${NODE_RUNTIME_VERSION:-22.23.4}"
ESBUILD_VERSION="0.24.0"
OUT_DIR="${OUT_DIR:-$ROOT/dist-mac}"
CACHE="$ROOT/.cache/node-runtime"
WORK="$OUT_DIR/work"
APP="$WORK/$APP_NAME.app"
RES="$APP/Contents/Resources"
DMG="$OUT_DIR/Coralogix-Lens-$VERSION${BUILD_SUFFIX:+-$BUILD_SUFFIX}.dmg"

log() { printf '\n==> %s\n' "$*"; }
sha256() { if command -v shasum >/dev/null; then shasum -a 256 "$@"; else sha256sum "$@"; fi; }

# ---------------------------------------------------------------- 1. check build outputs
log "Checking build outputs"
for f in packages/api/dist/server.js apps/cli/dist/index.js packages/ui/dist/index.html \
         packages/connectors/proto/metric-usages.protoset apps/desktop/src-tauri/icons/icon.icns fixtures/demo.json; do
  [ -e "$f" ] || { echo "Missing $f. Run: npm ci && npm run build" >&2; exit 1; }
done

rm -rf "$WORK"; mkdir -p "$APP/Contents/MacOS" "$RES/runtime" "$RES/bin" "$RES/server/proto" "$RES/fixtures"

# ---------------------------------------------------------------- 2. bundle engine and CLI
log "Bundling engine and CLI with esbuild $ESBUILD_VERSION"
BANNER="import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);"
npx --yes "esbuild@$ESBUILD_VERSION" packages/api/dist/server.js --bundle --platform=node --format=esm \
  --target=node20 --outfile="$RES/server/server.mjs" --banner:js="$BANNER" --log-level=warning
npx --yes "esbuild@$ESBUILD_VERSION" apps/cli/dist/index.js --bundle --platform=node --format=esm \
  --target=node20 --outfile="$RES/server/cli.mjs" --banner:js="$BANNER" --log-level=warning

cp -R packages/ui/dist "$RES/server/ui"
cp -R packages/rules "$RES/server/rules"
rm -rf "$RES/server/rules/node_modules"
cp -R skills "$RES/server/skills"
cp packages/connectors/proto/metric-usages.protoset "$RES/server/proto/"
cp fixtures/demo.json "$RES/fixtures/"
cp apps/desktop/src-tauri/icons/icon.icns "$RES/icon.icns"
[ -f README.md ] && cp README.md "$RES/README.md"

# ---------------------------------------------------------------- 3. Node.js runtimes (checksum-verified)
log "Fetching Node.js v$NODE_RUNTIME_VERSION for macOS (arm64 + x64)"
mkdir -p "$CACHE"
BASE="https://nodejs.org/dist/v$NODE_RUNTIME_VERSION"
curl -fsSL "$BASE/SHASUMS256.txt" -o "$CACHE/SHASUMS256-$NODE_RUNTIME_VERSION.txt"
for ARCH in arm64 x64; do
  TGZ="node-v$NODE_RUNTIME_VERSION-darwin-$ARCH.tar.gz"
  [ -f "$CACHE/$TGZ" ] || curl -fsSL "$BASE/$TGZ" -o "$CACHE/$TGZ"
  EXPECTED="$(grep " $TGZ\$" "$CACHE/SHASUMS256-$NODE_RUNTIME_VERSION.txt" | cut -d' ' -f1)"
  ACTUAL="$(sha256 "$CACHE/$TGZ" | cut -d' ' -f1)"
  [ -n "$EXPECTED" ] && [ "$EXPECTED" = "$ACTUAL" ] || { echo "Checksum mismatch for $TGZ" >&2; rm -f "$CACHE/$TGZ"; exit 1; }
  tar -xzf "$CACHE/$TGZ" -C "$CACHE" "node-v$NODE_RUNTIME_VERSION-darwin-$ARCH/bin/node" "node-v$NODE_RUNTIME_VERSION-darwin-$ARCH/LICENSE"
  cp "$CACHE/node-v$NODE_RUNTIME_VERSION-darwin-$ARCH/bin/node" "$RES/runtime/node-$ARCH"
done
cp "$CACHE/node-v$NODE_RUNTIME_VERSION-darwin-arm64/LICENSE" "$RES/runtime/NODE-LICENSE"

# ---------------------------------------------------------------- 4. assemble the bundle
log "Assembling $APP_NAME.app $VERSION"
cp "$HERE/launcher.sh" "$APP/Contents/MacOS/CoralogixLens"
cp "$HERE/cxlens.sh" "$RES/bin/cxlens"
sed "s/__VERSION__/$VERSION/g" "$HERE/Info.plist" > "$APP/Contents/Info.plist"
printf 'APPL????' > "$APP/Contents/PkgInfo"
chmod 755 "$APP/Contents/MacOS/CoralogixLens" "$RES/bin/cxlens" "$RES/runtime/node-arm64" "$RES/runtime/node-x64"
command -v plutil >/dev/null && plutil -lint "$APP/Contents/Info.plist"
bash -n "$APP/Contents/MacOS/CoralogixLens"; bash -n "$RES/bin/cxlens"

# ---------------------------------------------------------------- 5. smoke test the bundled engine
log "Smoke test: start the engine and run a demo CLI report"
if [ -z "${SMOKE_NODE:-}" ]; then
  case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) SMOKE_NODE="$RES/runtime/node-arm64" ;;
    Darwin-x86_64) SMOKE_NODE="$RES/runtime/node-x64" ;;
    *) SMOKE_NODE="$(command -v node)" ;;
  esac
fi
SMOKE_HOME="$(mktemp -d)"; SMOKE_PORT=4391
export CXLENS_UI_DIR="$RES/server/ui" CXLENS_RULES_DIR="$RES/server/rules" CXLENS_SKILLS_DIR="$RES/server/skills" CXLENS_PROTO_DIR="$RES/server/proto"
( cd "$RES" && CXLENS_HOME="$SMOKE_HOME" CXLENS_PORT="$SMOKE_PORT" "$SMOKE_NODE" server/server.mjs > "$SMOKE_HOME/engine.log" 2>&1 ) &
SMOKE_PID=$!
trap 'kill $SMOKE_PID 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do curl -fs -o /dev/null "http://127.0.0.1:$SMOKE_PORT/" && break; sleep 0.5; done
curl -fs "http://127.0.0.1:$SMOKE_PORT/" | grep -q "<title>Coralogix Lens</title>" \
  || { echo "Engine did not serve the UI. Log:" >&2; cat "$SMOKE_HOME/engine.log" >&2; exit 1; }
kill $SMOKE_PID 2>/dev/null || true; trap - EXIT
CXLENS_HOME="$SMOKE_HOME" "$SMOKE_NODE" "$RES/server/cli.mjs" analyze --demo --fixture "$RES/fixtures/demo.json" \
  --pillars universal,logs,traces,metrics --out "$SMOKE_HOME/report" | tail -n 3
[ -f "$SMOKE_HOME/report/assessment.json" ] || { echo "CLI demo report was not written" >&2; exit 1; }
rm -rf "$SMOKE_HOME"
echo "Smoke test passed"

# ---------------------------------------------------------------- 6. sign
if command -v codesign >/dev/null; then
  if [ -n "${SIGN_IDENTITY:-}" ]; then
    log "Signing with Developer ID: $SIGN_IDENTITY"
    for ARCH in arm64 x64; do
      codesign --force --timestamp --options runtime --entitlements "$HERE/entitlements.plist" \
        --sign "$SIGN_IDENTITY" "$RES/runtime/node-$ARCH"
    done
    codesign --force --timestamp --options runtime --sign "$SIGN_IDENTITY" "$APP"
  else
    log "Ad-hoc signing (no Developer ID configured; users approve the app once on first launch)"
    codesign --force --sign - "$APP"
  fi
  if [ -n "${SIGN_IDENTITY:-}" ]; then codesign --verify --strict --verbose=2 "$APP"
  else codesign --verify --verbose=2 "$APP" || echo "warning: ad-hoc signature check failed (the app still runs after first-launch approval)"; fi
else
  log "codesign not available (not macOS); skipping signing"
fi

if [ "${SKIP_DMG:-0}" = "1" ]; then log "SKIP_DMG=1: app is at $APP"; exit 0; fi

# ---------------------------------------------------------------- 7. DMG
command -v hdiutil >/dev/null || { echo "hdiutil not found: the DMG step needs macOS (set SKIP_DMG=1 elsewhere)" >&2; exit 1; }
log "Creating $DMG"
STAGE="$WORK/dmg"; rm -rf "$STAGE"; mkdir -p "$STAGE"
ditto "$APP" "$STAGE/$APP_NAME.app"
ln -s /Applications "$STAGE/Applications"
sed -e "s/__VERSION__/$VERSION/g" -e "s/__NODE_VERSION__/$NODE_RUNTIME_VERSION/g" "$HERE/Read Me First.txt" > "$STAGE/Read Me First.txt"
[ -f README.md ] && cp README.md "$STAGE/README.md"
rm -f "$DMG"
hdiutil create -volname "$APP_NAME" -srcfolder "$STAGE" -fs HFS+ -format UDZO -imagekey zlib-level=9 -ov "$DMG"
hdiutil verify "$DMG"
[ -n "${SIGN_IDENTITY:-}" ] && codesign --force --timestamp --sign "$SIGN_IDENTITY" "$DMG"

# ---------------------------------------------------------------- 8. notarize (optional)
if [ "${NOTARIZE:-0}" = "1" ]; then
  : "${SIGN_IDENTITY:?NOTARIZE=1 needs SIGN_IDENTITY}" "${APPLE_ID:?}" "${APPLE_APP_PASSWORD:?}" "${APPLE_TEAM_ID:?}"
  log "Notarizing (this usually takes a few minutes)"
  xcrun notarytool submit "$DMG" --apple-id "$APPLE_ID" --password "$APPLE_APP_PASSWORD" --team-id "$APPLE_TEAM_ID" --wait
  xcrun stapler staple "$DMG"
  xcrun stapler validate "$DMG"
fi

( cd "$OUT_DIR" && sha256 "$(basename "$DMG")" > "$(basename "$DMG").sha256" )
log "Done"
ls -lh "$DMG"; cat "$DMG.sha256"
