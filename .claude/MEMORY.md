# TradingView MCP Memory

## Cross-references (detail lives in git, not here)
- [Architecture & tool decision tree]: `CLAUDE.md`
- [Setup steps]: `SETUP_GUIDE.md`
- [Full tool reference (78 tools, CLI)]: `README.md`
- [Research context]: `RESEARCH.md`
- [Uninstall]: `scripts/uninstall.bat`
- [Context guards & response throttling]: `src/tools/_format.js` (thresholds at 50/100/200 KB)
- [Input sanitization]: `src/connection.js` — `safeString()`, `clampCount()`, `requireFinite()` + DI pattern in modules
- [Appx package detection for tv_launch]: `src/core/health.js` + `scripts/launch_tv_debug.bat`
- [Pine setSource async fix]: `src/core/pine.js` — `setTimeout` + `pushEditOperations` to avoid hang
- [Replay CLI enhancements]: compound start, -l/-c/-d/-H/-tf/-s/-i flags, flex dates, speed multipliers (merged to main)

## Gotchas (not discoverable from other sources)
- MCP config installed at `~/.claude/.mcp.json` pointing to this project's `src/server.js`
- TradingView must be launched with `--remote-debugging-port=9222` for CDP to work
- MCP server only loads on Claude Code startup — restart required after config changes
- Fork sync: upstream is `tradesdontlie/tradingview-mcp`. Use `git fetch upstream && git merge upstream/main` ONLY after verifying direction (see force-push gotcha below)
- No reinstall needed after code changes — just restart Claude Code
- 2 CLI tests (`pine check` via CLI) fail on Windows (exit code mismatch) — pre-existing
- TradingView installed as Appx (Developer-signed, `runFullTrust`) in WindowsApps — NOT from MS Store
- Appx version 3.0.0.7652 confirmed debuggable via CDP; no auto-update mechanism
- **e2e test results are TV-Desktop-version-pinned.** `tests/e2e.test.js` pokes TV's internal Electron JS surface (`window.TradingView.bottomWidgetBar.*`, replay APIs) which is unstable across TV builds. Before treating an e2e failure as a regression, check the TV version.
- TV Desktop **3.1.0.7818** (MSIX) failures observed 2026-05-07: `ui_open_panel` (`bottomWidgetBar.hideWidget` no longer a function), `replay_stop` (assertion fails — replay didn't exit cleanly). Both are likely TV-side API drift, not repo regressions.
- `tv_launch — auto-detect binary` test (e2e.test.js:142) is broken regardless of TV version: it only checks macOS paths, so it always fails on Windows/Linux. The production `launch()` in `src/core/health.js` has correct cross-platform detection (incl. Windows MSIX via `Get-AppxPackage`); the test reimplements detection wrongly. Fix: have the test call into the real resolver, not duplicate it.
- Upstream PRs merged: #20 (replay account corruption), #29 (replay_start selectDate fix), #30 (CDP sanitization + DI + tests)
- Upstream issue #26 (replay_start broken) was **FIXED** via PR #29
- Open upstream issues: #23 (bat Appx detection), #25 (runtime validation pattern)
- PR #24 (replay CLI enhancements) was closed — replay enhancements live in fork only
- Upstream force-pushes its `main` (rebase/squash) — `git fetch upstream` will show `forced update`. Fork is strictly ahead content-wise (583 lines fork-only as of 2026-05-08); don't panic-merge. Verify with `git log upstream/main..HEAD` and `git diff --stat HEAD upstream/main` before merging.
- Fork is **public on GitHub** — `doc/` is gitignored for local-only research notes; never commit personal/research material

## Memories
- [PR branches are upstream-only](feedback_pr_no_memory.md) — only upstream files + proposed changes, no fork state
- [User timezone is PT](user_timezone.md) — chart shows ET; replay API uses local PT, so subtract 3h from ET times
- [Check Pine Editor before injecting](feedback_pine_editor_check.md) — pine_set_source overwrites the active study, not a new one
- [8020 Okala cloning snapshot](project_8020_cloning.md) — trap=signal architecture, 15% conversion rate, v1.3 at 53% match
