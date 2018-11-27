if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

start /min cmd /C "node mainbot.js"
goto :EOF
:minimized
