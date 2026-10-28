# Automatic macOS DMG builds

Every push builds, tests and packages Coralogix Lens on a GitHub-hosted Apple Silicon Mac. The workflow is `.github/workflows/build-dmg.yml`, and the packaging logic is `packaging/macos/build-app.sh`.

## When it runs and where the DMG goes

| You do | What you get |
|---|---|
| Push to `main` | A DMG on the run's **Artifacts** list, plus the **latest** pre-release refreshed with `Coralogix-Lens-latest.dmg` |
| Open a pull request into `main` | A DMG on the run's **Artifacts** list (no release) |
| Push a tag such as `v0.2.0` | A GitHub Release called "Coralogix Lens 0.2.0" with the DMG and its checksum |
| Actions tab → Build macOS DMG → **Run workflow** | A build on demand |

A run takes about 5 to 10 minutes. If a newer push arrives while a build is running on the same branch, the older build is cancelled.

**Downloading:**
- **Newest build:** Releases → **latest** → `Coralogix-Lens-latest.dmg`. The link stays the same: `https://github.com/vibhutigoel22/cx-lens/releases/download/latest/Coralogix-Lens-latest.dmg`. The repo is private, so you need to be signed in to GitHub.
- **A specific build:** Actions → the run → **Artifacts**. GitHub delivers artifacts as a `.zip`; unzip it to get the `.dmg`. Artifacts are kept for 30 days.

**Releasing a version:**
```bash
npm version 0.2.0 --no-git-tag-version   # updates package.json
git commit -am "Release 0.2.0"
git tag v0.2.0
git push origin main --tags
```

## What each run does

1. `npm ci`, `npm run build`, then the full Vitest suite. **A failing test stops the build**, so a broken commit never produces a DMG.
2. Bundles the engine and the `cxlens` CLI into single files with esbuild (pinned version).
3. Downloads the official Node.js runtimes for Apple Silicon and Intel from nodejs.org, checks them against the published SHA-256 checksums, and caches them between runs.
4. Assembles `Coralogix Lens.app`.
5. **Smoke test:** starts the bundled engine, checks that it serves the UI, and runs a full four-pillar demo report with the bundled CLI.
6. Signs the app (ad-hoc by default, or with your Developer ID; see below).
7. Creates the DMG with Apple's `hdiutil` (zlib-compressed UDZO, the standard format), then runs `hdiutil verify`.
8. Uploads the DMG and its `.sha256`, publishes releases, and writes a summary on the run page.

## Building on your own Mac

```bash
npm ci && npm run build
bash packaging/macos/build-app.sh
# Output: dist-mac/Coralogix-Lens-<version>.dmg
```

Useful settings: `VERSION=0.2.0`, `NODE_RUNTIME_VERSION=22.23.4`, `SKIP_DMG=1` (build and test the .app only). The script header lists all of them.

## Removing the first-launch warning (optional)

Without signing secrets, builds are **ad-hoc signed**. macOS still shows "Apple could not verify…" the first time, and the user approves it once (README, "Allow the app the first time").

To remove that warning for everyone, add your Apple Developer ID. It needs a paid Apple Developer Program membership. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | What to put in it |
|---|---|
| `APPLE_CERTIFICATE_P12_BASE64` | Your **Developer ID Application** certificate exported from Keychain Access as `.p12`, then `base64 -i cert.p12 \| pbcopy` |
| `APPLE_CERTIFICATE_PASSWORD` | The password you set when exporting the `.p12` |
| `APPLE_SIGNING_IDENTITY` | The full name, e.g. `Developer ID Application: Your Name (TEAMID1234)` (`security find-identity -v -p codesigning` shows it) |
| `APPLE_ID` | Your Apple ID email (for notarization) |
| `APPLE_APP_PASSWORD` | An app-specific password from appleid.apple.com → Sign-In and Security |
| `APPLE_TEAM_ID` | Your 10-character Team ID |

With the first three set, builds are signed with your Developer ID and the hardened runtime. The bundled Node.js gets the entitlements in `entitlements.plist`, which V8 needs for JIT. With all six set, the DMG is also notarized by Apple and stapled, so it opens with no warning. The signing keychain is temporary and deleted with the runner.

Signing and notarization run only when the secrets exist. They have not been exercised yet, so check the first signed run's log.

## Changing things

| To change | Edit |
|---|---|
| Bundled Node.js version | `NODE_RUNTIME_VERSION` in the workflow (pick a release at least two weeks old) |
| What happens when the app is opened | `packaging/macos/launcher.sh` |
| App name, bundle ID, minimum macOS | `packaging/macos/Info.plist` |
| Text shown in the DMG | `packaging/macos/Read Me First.txt` and the repo `README.md` |
| Which branches trigger builds | `on:` at the top of the workflow |

## Troubleshooting

- **Build fails at "Run tests":** a test is failing on that commit. Open the step's log, fix the test, and push again.
- **"Missing packages/…/dist/…":** `npm run build` did not produce that file. Check the Build step.
- **"Checksum mismatch":** the Node.js download was damaged. Re-run the job; the bad file is deleted automatically.
- **Release step fails with "Resource not accessible by integration":** go to Settings → Actions → General → Workflow permissions and choose **Read and write permissions**.
