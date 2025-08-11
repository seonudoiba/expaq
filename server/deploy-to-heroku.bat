@echo off
REM Heroku Deployment Script for Expaq (Windows)

echo Starting Expaq Heroku Deployment...
echo.

REM Check if Heroku CLI is installed
where heroku >nul 2>nul
if %errorlevel% neq 0 (
    echo Heroku CLI is not installed. Please install it first.
    echo Visit: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Login to Heroku
echo Logging into Heroku...
heroku login

REM Set app name (change this to your preferred name)
set APP_NAME=expaq-api

REM Check if app exists
heroku apps:info --app %APP_NAME% >nul 2>nul
if %errorlevel% equ 0 (
    echo App %APP_NAME% already exists
) else (
    echo Creating Heroku app: %APP_NAME%
    heroku create %APP_NAME%
)

REM Add PostgreSQL addon
echo Checking PostgreSQL addon...
heroku addons --app %APP_NAME% | findstr "heroku-postgresql" >nul
if %errorlevel% equ 0 (
    echo PostgreSQL already configured
) else (
    echo Adding PostgreSQL database...
    heroku addons:create heroku-postgresql:mini --app %APP_NAME%
)

REM Set environment variables
echo Setting environment variables...

heroku config:set APP_JWT_SECRET="your-super-secret-jwt-key-change-this" --app %APP_NAME%
heroku config:set APP_JWT_EXPIRATION=86400000 --app %APP_NAME%
heroku config:set APP_JWT_EXPIRATION_IN_MS=86400000 --app %APP_NAME%
heroku config:set APP_BASE_URL="https://%APP_NAME%.herokuapp.com" --app %APP_NAME%
heroku config:set FRONTEND_URL="https://expaq-tour.vercel.app" --app %APP_NAME%

echo.
echo Please set the following environment variables manually:
echo    - SPRING_MAIL_USERNAME
echo    - SPRING_MAIL_PASSWORD
echo    - CLOUDINARY_CLOUD_NAME
echo    - CLOUDINARY_API_KEY
echo    - CLOUDINARY_API_SECRET
echo    - PAYSTACK_SECRET_KEY
echo    - PAYSTACK_PUBLIC_KEY
echo.
echo Use: heroku config:set VARIABLE_NAME=value --app %APP_NAME%
echo.
pause

REM Add git remote
git remote | findstr "heroku" >nul
if %errorlevel% equ 0 (
    echo Heroku remote already configured
) else (
    echo Adding Heroku git remote...
    heroku git:remote -a %APP_NAME%
)

REM Build the application
echo Building application...
call mvnw.cmd clean package -DskipTests

REM Deploy to Heroku
echo Deploying to Heroku...
git add .
git commit -m "Deploy to Heroku"
git push heroku main

REM Open the app
echo Opening application...
heroku open --app %APP_NAME%

REM Show logs
echo Showing application logs...
heroku logs --tail --app %APP_NAME%

pause