@echo off
echo Setting Heroku config vars from .env file...

REM Update APP_BASE_URL for Heroku
heroku config:set APP_BASE_URL=https://expaq-afde0b1f18f8.herokuapp.com -a expaq

REM Set all environment variables from .env file
for /f "tokens=1,2 delims==" %%a in (.env) do (
    echo %%a | findstr /r "^#" >nul
    if errorlevel 1 (
        if not "%%a"=="" (
            echo Setting %%a...
            heroku config:set %%a=%%b -a expaq
        )
    )
)

echo.
echo Done! View your config with: heroku config -a expaq