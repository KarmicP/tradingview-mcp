# TradingView MCP Memory

## Cross-references (detail lives in git, not here)
- [Architecture & tool decision tree]: `CLAUDE.md`
- [Setup steps]: `SETUP_GUIDE.md`
- [Full tool reference (68+ tools, CLI)]: `README.md`
- [Research context]: `RESEARCH.md`
- [Uninstall]: `scripts/uninstall.bat`
- [Context guards & response throttling]: `src/tools/_format.js` (thresholds at 50/100/200 KB)
- [Input sanitization]: `src/connection.js` — `safeString()`, `clampCount()`, `requireFinite()`
- [Appx package detection for tv_launch]: `src/core/health.js` + `scripts/launch_tv_debug.bat`
- [Pine setSource async fix]: `src/core/pine.js` — `setTimeout` + `pushEditOperations` to avoid hang
- [Replay CLI enhancements]: branch `feat/replay-cli-enhancements` — compound start, -l/-c/-d/-H/-tf/-s/-i flags, flex dates, speed multipliers

## Gotchas (not discoverable from other sources)
- MCP config installed at `~/.claude/.mcp.json` pointing to this project's `src/server.js`
- TradingView must be launched with `--remote-debugging-port=9222` for CDP to work
- MCP server only loads on Claude Code startup — restart required after config changes
- Fork sync: upstream is `tradesdontlie/tradingview-mcp`, sync with `git fetch upstream && git merge upstream/main`
- No reinstall needed after code changes — just restart Claude Code
- 2 CLI tests (`pine check` via CLI) fail on Windows (exit code mismatch) — pre-existing
- TradingView installed as Appx (Developer-signed, `runFullTrust`) in WindowsApps — NOT from MS Store
- Appx version 3.0.0.7652 confirmed debuggable via CDP; no auto-update mechanism
- **replay_start is broken upstream** (issue #26): `selectDate()` sets internal state but doesn't init replay server session — chart shows full session, stepping stuck. Only `selectFirstAvailableDate()` works.
- Upstream PRs: #21 (replay date injection), #22 (CDP sanitization, 9 modules), #24 (closed, replay CLI — reopen when #26 fixed)
- Upstream issues: #23 (bat Appx detection), #25 (runtime validation pattern), #26 (replay_start broken)
