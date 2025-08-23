#!/bin/bash

# Script to set Heroku environment variables from .env file
# Usage: ./set-heroku-env.sh

echo "Setting Heroku config vars from .env file..."

# Read .env file and set Heroku config vars
while IFS='=' read -r key value
do
  # Skip empty lines and comments
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    # Remove any surrounding quotes from value
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    
    echo "Setting $key..."
    heroku config:set "$key=$value" -a expaq
  fi
done < .env

echo "Done! View your config with: heroku config -a expaq"