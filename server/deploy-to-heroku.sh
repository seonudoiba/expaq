#!/bin/bash

# Heroku Deployment Script for Expaq
# Make sure to run: chmod +x deploy-to-heroku.sh

echo "🚀 Starting Expaq Heroku Deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
echo "📝 Logging into Heroku..."
heroku login

# App name (change this to your preferred name)
APP_NAME="expaq-api"

# Check if app exists, if not create it
if heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "✅ App $APP_NAME already exists"
else
    echo "📱 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
fi

# Add PostgreSQL addon if not exists
echo "🗄️ Checking PostgreSQL addon..."
if heroku addons --app $APP_NAME | grep -q "heroku-postgresql"; then
    echo "✅ PostgreSQL already configured"
else
    echo "📊 Adding PostgreSQL database..."
    heroku addons:create heroku-postgresql:mini --app $APP_NAME
fi

# Set environment variables
echo "🔧 Setting environment variables..."

# Function to set config var
set_config() {
    heroku config:set $1="$2" --app $APP_NAME
}

# JWT Configuration
set_config "APP_JWT_SECRET" "your-super-secret-jwt-key-$(openssl rand -hex 32)"
set_config "APP_JWT_EXPIRATION" "86400000"
set_config "APP_JWT_EXPIRATION_IN_MS" "86400000"

# Application URLs
set_config "APP_BASE_URL" "https://$APP_NAME.herokuapp.com"
set_config "FRONTEND_URL" "https://expaq-tour.vercel.app"

echo "⚠️  Please set the following environment variables manually:"
echo "   - SPRING_MAIL_USERNAME"
echo "   - SPRING_MAIL_PASSWORD"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - PAYSTACK_SECRET_KEY"
echo "   - PAYSTACK_PUBLIC_KEY"

echo ""
echo "Use: heroku config:set VARIABLE_NAME=value --app $APP_NAME"
echo ""

# Add git remote if not exists
if git remote | grep -q "heroku"; then
    echo "✅ Heroku remote already configured"
else
    echo "🔗 Adding Heroku git remote..."
    heroku git:remote -a $APP_NAME
fi

# Build the application
echo "🔨 Building application..."
./mvnw clean package -DskipTests

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open the app
echo "🌐 Opening application..."
heroku open --app $APP_NAME

# Show logs
echo "📋 Showing application logs..."
heroku logs --tail --app $APP_NAME