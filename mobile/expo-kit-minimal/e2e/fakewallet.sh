#!/usr/bin/env bash
#
# L3 end-to-end tests: the real app, on a real emulator, driving a real wallet.
#
#   npm run e2e
#
# Runs every Mobile Wallet Adapter flow the demo exposes, plus the failure paths, against
# fakewallet from the mobile-wallet-adapter repo. See ./README.md for setup.
#
# Why fakewallet and not a shipping wallet: it needs no passcode, no slide-to-approve and no
# "unknown site" trust prompt, and it can be told to fail on demand. Nothing here needs SOL.
#
# Three things this script does deliberately, each of which produced confidently wrong results
# when it was written the obvious way instead:
#
#   * Foreground checks are scoped to the RESUMED activity. The wallet stays in the task stack
#     after a flow, so grepping all of `dumpsys activity activities` reports it as foreground
#     forever, and the reset routine taps buttons that are not on screen.
#   * Assertions require a TRANSITION, not a state. "the connect button is visible" passes
#     vacuously when the app was already disconnected, so a flow that never ran looks green.
#   * Unhandled-rejection detection compares LogBox ids. The overlay is sticky, so one left by
#     an earlier flow is still on screen during the next and gets blamed on the wrong test.
set -uo pipefail

cd "$(dirname "$0")/.."

ADB="${ADB:-${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb}"
# Read from app.json so a renamed project keeps working. Override with APP=... to point elsewhere.
APP="${APP:-$(node -p "require('./app.json').expo.android.package" 2>/dev/null)}"
FW=com.solana.mobilewalletadapter.fakewallet
SNAP="${TMPDIR:-/tmp}/e2e-uisnap.xml"
PASS=0; FAIL=0; FAILED=()

snap() {
  $ADB shell uiautomator dump /sdcard/e2e-ui.xml >/dev/null 2>&1
  $ADB shell cat /sdcard/e2e-ui.xml 2>/dev/null | tr '<' '\n<' > "$SNAP"
}
hasg()      { grep -q -- "$1" "$SNAP"; }
in_wallet() { $ADB shell dumpsys activity activities 2>/dev/null \
                | grep -oE 'topResumedActivity=[^}]*' | grep -q "$FW/"; }
app_front() { $ADB shell am start -n "$APP/.MainActivity" >/dev/null 2>&1; sleep 2; }

rn_err()    { grep -oE 'text="[^"]*(Uncaught|Unhandled)[^"]*"' "$SNAP" | head -1; }
rn_err_id() { grep -oE 'Uncaught \(in promise, id: [0-9]+' "$SNAP" | grep -oE '[0-9]+$' | tail -1; }
rn_err_new() { local now; now=$(rn_err_id); [ -n "$now" ] && [ "$now" != "${1:-}" ] && rn_err; }

wait_for() {  # pattern [timeout_s]
  local end=$(( SECONDS + ${2:-20} ))
  while [ "$SECONDS" -lt "$end" ]; do
    snap; hasg "$1" && return 0
    sleep 1
  done
  return 1
}

tap() {  # pattern
  local c x y
  snap
  c=$(grep -- "$1" "$SNAP" | head -1 \
      | sed -n 's/.*bounds="\[\([0-9]*\),\([0-9]*\)\]\[\([0-9]*\),\([0-9]*\)\].*/\1 \2 \3 \4/p')
  [ -z "$c" ] && return 1
  x=$(echo "$c" | awk '{print int(($1+$3)/2)}')
  y=$(echo "$c" | awk '{print int(($2+$4)/2)}')
  $ADB shell input tap "$x" "$y"
}

ok()  { echo "  PASS   $1"; PASS=$((PASS+1)); }
bad() { echo "  FAIL   $1 -- $2"; FAIL=$((FAIL+1)); FAILED+=("$1"); }

CONNECTED='text="Connected to fakewallet account 0"'
DISCONNECTED='text="SIGN IN AND CONNECT"'

# Seeker Connect draws its own error card over the app after a failed wallet flow. It is the
# failure the user sees, and it has to be closed before the screen underneath can be read. The
# card's title is the one node that carries the same string as both text and content-desc, which
# keeps the message apart from the app's own text in the same dump.
sc_card()  { hasg 'content-desc="Solana Mobile"' && hasg 'text="Close"'; }
sc_card_text() {
  local t
  grep -oE 'content-desc="[^"]+"' "$SNAP" | sed 's/content-desc=//' | grep -v '"Close"\|"Solana Mobile"' \
    | while read -r t; do if hasg "text=$t"; then echo "text=$t"; break; fi; done
}
sc_close() { tap 'text="Close"' >/dev/null 2>&1; sleep 2; }

ensure_disconnected() {
  app_front
  for _ in 1 2 3 4; do
    snap
    if sc_card;                  then sc_close; continue; fi
    if hasg "$DISCONNECTED" && ! hasg "$CONNECTED"; then return 0; fi
    if in_wallet;                then tap 'id/btn_decline"'   >/dev/null 2>&1; sleep 2; app_front; continue; fi
    if hasg 'text="DISCONNECT"'; then tap 'text="DISCONNECT"' >/dev/null 2>&1; sleep 3; app_front; continue; fi
    sleep 2
  done
  snap; hasg "$DISCONNECTED" && ! hasg "$CONNECTED"
}

# Trigger an app action and answer the wallet. Fails when the wallet never appears, so a handoff
# that silently did not happen cannot pass.
drive() {  # <app-button-text> <wallet-fragment-id> <wallet-button-id>
  tap "text=\"$1\"" || { echo "         (app button not found: $1)"; return 1; }
  wait_for "id/$2\"" 25 || { echo "         (wallet never reached fragment: $2)"; return 2; }
  tap "id/$3\"" || { echo "         (wallet button not found: $3)"; return 3; }
  sleep 3; app_front
}

# A wallet-side failure must leave the app unbound, show the user something, and not leak an
# unhandled rejection.
injection_test() {  # <label> <wallet-button-id>
  local label="$1" btn="$2" base e shown
  ensure_disconnected || { bad "$label" "could not reach a disconnected baseline"; return; }
  snap; base=$(rn_err_id)
  drive 'Connect with Seeker' authorize "$btn" || { bad "$label" "flow did not execute"; return; }
  snap
  shown=""
  if sc_card; then shown=$(sc_card_text); sc_close; snap; fi
  hasg "$CONNECTED"     && { bad "$label" "an account was bound despite $btn"; return; }
  hasg "$DISCONNECTED"  || { bad "$label" "app left in an unknown state"; return; }
  e=$(rn_err_new "$base")
  [ -z "$shown" ] && shown=$(grep -oE 'text="[^"]*[Ff]ailed[^"]*"' "$SNAP" | head -1)
  if   [ -n "$e" ];     then bad "$label" "unhandled rejection leaked: $e"
  elif [ -z "$shown" ]; then bad "$label" "the failure was swallowed, nothing shown to the user"
  else ok "$label ($shown)"; fi
}

echo "=== preflight ==="
[ -x "$ADB" ] || { echo "adb not found at $ADB -- set ADB or ANDROID_HOME"; exit 1; }
[ -n "$APP" ] || { echo "could not read expo.android.package from app.json -- set APP"; exit 1; }
case "$($ADB devices | sed -n '2p' | wc -l | tr -d ' ')" in 0) echo "no device; run: npm run android"; exit 1;; esac
$ADB shell pm list packages 2>/dev/null | grep -q "$FW"  || { echo "fakewallet not installed -- see e2e/README.md"; exit 1; }
$ADB shell pm list packages 2>/dev/null | grep -q "$APP" || { echo "$APP not installed -- run: npm run android"; exit 1; }
echo "  app:    $APP"
echo "  wallet: $FW"
ensure_disconnected || { echo "FATAL: cannot reach a disconnected baseline; is the dev server running?"; exit 1; }
echo "  baseline: disconnected"

echo
echo "=== flows ==="

if drive 'Connect with Seeker' authorize btn_authorize && wait_for "$CONNECTED" 20; then
  ok "connect binds an account"
  snap; hasg 'text="Balance: 0 SOL"' && ok "balance is read" || bad "balance is read" "no balance rendered"
else
  bad "connect binds an account" "flow failed"
fi

snap
if hasg 'text="SIGN MESSAGE"'; then
  if drive "SIGN MESSAGE" sign_payloads btn_authorize && wait_for 'Signed a message with' 20; then
    ok "sign message reports success"
  else
    bad "sign message" "no success shown in the UI"
  fi
else
  bad "sign message" "precondition: the sign message button is not on screen"
fi

if drive "SIGN IN WITH FAKEWALLET ACCOUNT 0" sign_payloads btn_authorize && wait_for 'Signed in with' 20; then
  ok "sign in reports success"
else
  bad "sign in" "no success shown in the UI"
fi

if tap 'text="CONNECT TO TESTNET"' && wait_for 'text="Connected to Testnet"' 20; then
  ok "cluster switches to testnet"
  tap 'text="CONNECT TO DEVNET"' && wait_for 'text="Connected to Devnet"' 20 \
    && ok "cluster switches back to devnet" || bad "cluster switches back to devnet" "never switched back"
else
  bad "cluster switches to testnet" "never switched"
fi

snap
if hasg 'text="DISCONNECT"'; then
  tap 'text="DISCONNECT"'
  if wait_for "$DISCONNECTED" 15 && snap && ! hasg "$CONNECTED"; then
    ok "disconnect clears the account"
  else
    bad "disconnect clears the account" "an account is still bound"
  fi
else
  bad "disconnect clears the account" "precondition: not connected"
fi

echo
echo "=== wallet-side failures ==="
injection_test "declined authorization" btn_decline
injection_test "wallet internal error"  btn_simulate_internal_error
injection_test "unsupported cluster"    btn_simulate_cluster_not_supported

if ensure_disconnected && drive 'Connect with Seeker' authorize btn_authorize && wait_for "$CONNECTED" 20; then
  snap; IP_BASE=$(rn_err_id)
  if drive "SIGN MESSAGE" sign_payloads btn_simulate_invalid_payloads; then
    snap
    e=$(rn_err_new "$IP_BASE")
    shown=$(grep -oiE 'text="[^"]*sign message failed[^"]*"' "$SNAP" | head -1)
    if [ -z "$shown" ] && sc_card; then shown=$(sc_card_text); sc_close; fi
    if   [ -n "$e" ];     then bad "invalid payload" "unhandled rejection leaked: $e"
    elif [ -z "$shown" ]; then bad "invalid payload" "the failure was swallowed"
    else ok "invalid payload ($shown)"; fi
  else
    bad "invalid payload" "flow did not execute"
  fi
else
  bad "invalid payload" "could not establish a session"
fi

echo
echo "=== $PASS passed, $FAIL failed ==="
for n in ${FAILED+"${FAILED[@]}"}; do echo "  failed: $n"; done
[ "$FAIL" -eq 0 ]
