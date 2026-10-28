#!/bin/bash
# cxlens command-line tool, using the runtime bundled inside Coralogix Lens.app.
# Install once:  sudo ln -sf "/Applications/Coralogix Lens.app/Contents/Resources/bin/cxlens" /usr/local/bin/cxlens
SRC="${BASH_SOURCE[0]}"; while [ -L "$SRC" ]; do T="$(readlink "$SRC")"; case "$T" in /*) SRC="$T";; *) SRC="$(dirname "$SRC")/$T";; esac; done
RES="$(cd "$(dirname "$SRC")/.." && pwd)"
if [ "$(uname -m)" = "arm64" ] || [ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" = "1" ]; then NODE="$RES/runtime/node-arm64"; else NODE="$RES/runtime/node-x64"; fi
ARGS=("$@")
case " $* " in *" --demo "*) case " $* " in *" --fixture "*) ;; *) ARGS+=(--fixture "$RES/fixtures/demo.json");; esac;; esac
CXLENS_RULES_DIR="$RES/server/rules" CXLENS_SKILLS_DIR="$RES/server/skills" CXLENS_PROTO_DIR="$RES/server/proto" exec "$NODE" "$RES/server/cli.mjs" "${ARGS[@]}"
