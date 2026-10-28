#!/bin/bash
# Coralogix Lens launcher: starts the local engine (127.0.0.1 only) with the bundled Node.js and opens the app window.
APP_NAME="Coralogix Lens"
HERE="$(cd "$(dirname "$0")" && pwd)"
RES="$(cd "$HERE/../Resources" && pwd)"
STATE="$HOME/.cxlens/app"
LOGDIR="$HOME/Library/Logs/Coralogix Lens"
LOG="$LOGDIR/engine.log"
mkdir -p "$STATE" "$LOGDIR"

alert() { /usr/bin/osascript -e "display alert \"$APP_NAME\" message \"$1\" as critical" >/dev/null 2>&1; }

# Pick the runtime for this Mac (Apple Silicon or Intel).
if [ "$(uname -m)" = "arm64" ] || [ "$(/usr/sbin/sysctl -n sysctl.proc_translated 2>/dev/null)" = "1" ]; then
  NODE="$RES/runtime/node-arm64"
else
  NODE="$RES/runtime/node-x64"
fi
/usr/bin/xattr -d com.apple.quarantine "$NODE" >/dev/null 2>&1 || true
chmod +x "$NODE" 2>/dev/null || true

# Apps opened from Finder get a minimal PATH. Load the user's shell PATH so cx, claude, helm and otelcol-contrib are found.
SHELL_PATH="$("${SHELL:-/bin/zsh}" -lic 'printf "__CXP__%s__CXP__" "$PATH"' 2>/dev/null </dev/null | sed -n 's/.*__CXP__\(.*\)__CXP__.*/\1/p' | tail -n1)"
export PATH="${SHELL_PATH:+$SHELL_PATH:}/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$HOME/.claude/local:$HOME/.npm-global/bin:/usr/bin:/bin:/usr/sbin:/sbin"

url_for() { echo "http://127.0.0.1:$1/"; }
alive() { [ -n "$1" ] && /usr/bin/curl -s -o /dev/null -m 2 "$(url_for "$1")"; }

open_window() {
  local url="$1" b
  # Prefer a Chromium browser in app mode: a clean window without tabs or address bar.
  for b in "Google Chrome" "Microsoft Edge" "Brave Browser" "Chromium"; do
    for d in "/Applications" "$HOME/Applications"; do
      if [ -x "$d/$b.app/Contents/MacOS/$b" ]; then
        "$d/$b.app/Contents/MacOS/$b" --app="$url" >/dev/null 2>&1 &
        disown 2>/dev/null; return
      fi
    done
  done
  /usr/bin/open "$url"
}

# Already running? Offer to open the window or stop the engine.
PID="$(cat "$STATE/engine.pid" 2>/dev/null)"; PORT="$(cat "$STATE/engine.port" 2>/dev/null)"
if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null && alive "$PORT"; then
  CHOICE="$(/usr/bin/osascript -e "button returned of (display dialog \"$APP_NAME is already running.\" buttons {\"Stop Coralogix Lens\", \"Open Window\"} default button \"Open Window\" with title \"$APP_NAME\")" 2>/dev/null)"
  if [ "$CHOICE" = "Stop Coralogix Lens" ]; then
    kill "$PID" 2>/dev/null; rm -f "$STATE/engine.pid" "$STATE/engine.port"
    /usr/bin/osascript -e "display notification \"The local engine has stopped.\" with title \"$APP_NAME\"" >/dev/null 2>&1
  elif [ -n "$CHOICE" ]; then
    open_window "$(url_for "$PORT")"
  fi
  exit 0
fi

# Choose a port: 4319 if free, otherwise any free port.
PORT="$("$NODE" -e 'const n=require("net");const t=(p)=>new Promise(r=>{const s=n.createServer();s.once("error",()=>r(null));s.listen(p,"127.0.0.1",()=>{const a=s.address().port;s.close(()=>r(a))})});(async()=>console.log((await t(4319))||(await t(0))))()' 2>>"$LOG")"
if [ -z "$PORT" ]; then
  alert "The bundled engine could not start on this Mac. Details are in ~/Library/Logs/Coralogix Lens/engine.log"; exit 1
fi

echo "---- $(date) starting on port $PORT ($(basename "$NODE"))" >> "$LOG"
cd "$RES" || exit 1
CXLENS_PORT="$PORT" \
CXLENS_UI_DIR="$RES/server/ui" \
CXLENS_RULES_DIR="$RES/server/rules" \
CXLENS_SKILLS_DIR="$RES/server/skills" \
CXLENS_PROTO_DIR="$RES/server/proto" \
nohup "$NODE" "$RES/server/server.mjs" >> "$LOG" 2>&1 &
echo $! > "$STATE/engine.pid"; echo "$PORT" > "$STATE/engine.port"

for _ in $(seq 1 60); do alive "$PORT" && break; sleep 0.25; done
if ! alive "$PORT"; then
  alert "The local engine did not start. Details are in ~/Library/Logs/Coralogix Lens/engine.log"; exit 1
fi
open_window "$(url_for "$PORT")"
exit 0
