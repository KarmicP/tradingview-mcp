@echo off
REM Uninstall TradingView MCP
REM Removes MCP config entry, npm link, and optionally the project folder

echo === TradingView MCP Uninstaller ===
echo.

REM 1. Remove from Claude Code MCP config
set "MCP_CONFIG=%USERPROFILE%\.claude\.mcp.json"
if exist "%MCP_CONFIG%" (
    echo Removing tradingview from %MCP_CONFIG%...
    node -e "const fs=require('fs');const f='%MCP_CONFIG:\=%';const c=JSON.parse(fs.readFileSync(f,'utf8'));if(c.mcpServers&&c.mcpServers.tradingview){delete c.mcpServers.tradingview;if(Object.keys(c.mcpServers).length===0){fs.unlinkSync(f);console.log('  Deleted empty .mcp.json')}else{fs.writeFileSync(f,JSON.stringify(c,null,2)+'\n');console.log('  Removed tradingview entry')}}else{console.log('  No tradingview entry found')}"
) else (
    echo No MCP config found at %MCP_CONFIG%, skipping.
)
echo.

REM 2. Remove npm global link if it exists
where tv >nul 2>&1
if %errorlevel% equ 0 (
    echo Removing global 'tv' CLI command...
    npm unlink -g tradingview-mcp >nul 2>&1
    echo   Done.
) else (
    echo No global 'tv' CLI command found, skipping.
)
echo.

REM 3. Ask about deleting the project folder
set "PROJECT_DIR=%~dp0.."
echo Project folder: %PROJECT_DIR%
echo.
set /p DELETE_PROJECT="Delete the project folder? (y/N): "
if /i "%DELETE_PROJECT%"=="y" (
    echo Deleting %PROJECT_DIR%...
    cd /d "%USERPROFILE%"
    rmdir /s /q "%PROJECT_DIR%"
    echo   Deleted.
) else (
    echo Keeping project folder.
)

echo.
echo Uninstall complete. Restart Claude Code to apply changes.
pause
