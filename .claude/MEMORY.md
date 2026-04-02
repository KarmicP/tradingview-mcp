# TradingView MCP Memory

## Cross-references (detail lives in git, not here)
- [Architecture & tool decision tree]: `CLAUDE.md`
- [Setup steps]: `SETUP_GUIDE.md`
- [Full tool reference (68 tools, CLI)]: `README.md`
- [Research context]: `RESEARCH.md`
- [Uninstall]: `scripts/uninstall.bat`
- [Context guards & response throttling]: `src/tools/_format.js` (thresholds at 50/100/200 KB)
- [Input sanitization]: `src/connection.js` — `safeString()` and `clampCount()` utilities

## Gotchas (not discoverable from other sources)
- MCP config installed at `~/.claude/.mcp.json` pointing to this project's `src/server.js`
- TradingView must be launched with `--remote-debugging-port=9222` for CDP to work
- MCP server only loads on Claude Code startup — restart required after config changes
- Fork sync: upstream is `tradesdontlie/tradingview-mcp`, sync with `git fetch upstream && git merge upstream/main`
- No reinstall needed after code changes — just restart Claude Code
- 2 CLI tests (`pine check` via CLI) fail on Windows (exit code mismatch) — pre-existing, not a regression
