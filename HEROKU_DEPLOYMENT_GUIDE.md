# Expaq Heroku Deployment Guide

## Prerequisites

1. **Heroku CLI**: Install from https://devcenter.heroku.com/articles/heroku-cli
2. **Git**: Ensure Git is installed and configured
3. **Heroku Account**: Sign up at https://heroku.com

## Step 1: Prepare Your Application

All necessary files have been created:
- ✅ `Procfile` - Tells Heroku how to run your app
- ✅ `system.properties` - Specifies Java 17
- ✅ `application-prod.properties` - Production configuration
- ✅ `HerokuDatabaseConfig.java` - Handles Heroku's DATABASE_URL format

## Step 2: Login to Heroku

```bash
heroku login
```

## Step 3: Create Heroku Application

```bash
# Navigate to server directory
cd C:\Users\Starr\Desktop\projects\expaq\server

# Create a new Heroku app (replace 'expaq-api' with your preferred name)
heroku create expaq-api
```

## Step 4: Add PostgreSQL Database

```bash
# Add Heroku Postgres addon (free tier)
heroku addons:create heroku-postgresql:mini
```

## Step 5: Configure Environment Variables

Set all required environment variables:

```bash
# JWT Configuration
heroku config:set APP_JWT_SECRET="your-super-secret-jwt-key-change-this"
heroku config:set APP_JWT_EXPIRATION=86400000
heroku config:set APP_JWT_EXPIRATION_IN_MS=86400000

# Email Configuration (using SendGrid)
# First, add SendGrid addon:
heroku addons:create sendgrid:starter

# Or set Gmail SMTP manually:
heroku config:set SPRING_MAIL_USERNAME="your-email@gmail.com"
heroku config:set SPRING_MAIL_PASSWORD="your-app-specific-password"

# Cloudinary Configuration (for image uploads)
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
heroku config:set CLOUDINARY_API_KEY="your-cloudinary-api-key"
heroku config:set CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Paystack Configuration
heroku config:set PAYSTACK_SECRET_KEY="your-paystack-secret-key"
heroku config:set PAYSTACK_PUBLIC_KEY="your-paystack-public-key"

# Stripe Configuration (if using Stripe)
heroku config:set STRIPE_API_KEY="your-stripe-api-key"
heroku config:set STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# OAuth2 Configuration (optional)
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"
heroku config:set GITHUB_CLIENT_ID="your-github-client-id"
heroku config:set GITHUB_CLIENT_SECRET="your-github-client-secret"

# Application URLs
heroku config:set APP_BASE_URL="https://expaq-api.herokuapp.com"
heroku config:set FRONTEND_URL="https://expaq-tour.vercel.app"

# Exchange Rate API (optional)
heroku config:set EXCHANGE_API_KEY="your-exchange-api-key"
```

## Step 6: Deploy Your Application

### Option A: Deploy via Git (Recommended)

```bash
# Initialize git if not already done
git init

# Add Heroku remote
heroku git:remote -a expaq-api

# Add all files
git add .

# Commit changes
git commit -m "Initial Heroku deployment"

# Deploy to Heroku
git push heroku main
```

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. In Heroku Dashboard → Deploy tab
3. Connect to GitHub repository
4. Enable automatic deploys from main branch

## Step 7: Build and Deploy

The deployment will automatically:
1. Detect Java application
2. Run Maven build
3. Execute tests
4. Create JAR file
5. Start application using Procfile

Monitor the build:
```bash
heroku logs --tail
```

## Step 8: Database Migration

If this is your first deployment, the database tables will be created automatically due to:
```properties
spring.jpa.hibernate.ddl-auto=update
```

For production, consider changing this to `validate` after initial setup.

## Step 9: Verify Deployment

```bash
# Open your app
heroku open

# Check application health
curl https://expaq-api.herokuapp.com/actuator/health

# View logs
heroku logs --tail

# Check database connection
heroku pg:info
```

## Step 10: Scale Your Application (Optional)

```bash
# Scale to 1 web dyno (free tier)
heroku ps:scale web=1

# For production (paid):
heroku ps:scale web=2
```

## Troubleshooting

### Common Issues and Solutions

1. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL
   heroku config:get DATABASE_URL
   
   # Restart dynos
   heroku restart
   ```

2. **Memory Issues**
   - Add to Procfile: `-Xmx512m` for memory limit
   ```
   web: java -Xmx512m -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/expaq-0.0.1-SNAPSHOT.jar
   ```

3. **Build Failures**
   ```bash
   # Clear cache and rebuild
   heroku plugins:install heroku-builds
   heroku builds:cache:purge
   git commit --allow-empty -m "Rebuild"
   git push heroku main
   ```

4. **View Real-time Logs**
   ```bash
   heroku logs --tail --app expaq-api
   ```

5. **Connect to Database**
   ```bash
   heroku pg:psql
   ```

## Monitoring and Maintenance

### Health Checks
```bash
# Add health check
heroku config:set HEALTH_CHECK_URL=https://expaq-api.herokuapp.com/actuator/health
```

### Backup Database
```bash
# Create backup
heroku pg:backups:capture

# Schedule daily backups
heroku pg:backups:schedule DATABASE_URL --at '02:00 America/New_York'
```

### View Metrics
```bash
heroku metrics:dashboard
```

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Automatically set by Heroku | Yes (Auto) |
| APP_JWT_SECRET | JWT signing secret | Yes |
| APP_JWT_EXPIRATION | JWT expiration time | Yes |
| SPRING_MAIL_USERNAME | Email username | Yes |
| SPRING_MAIL_PASSWORD | Email password | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| PAYSTACK_SECRET_KEY | Paystack secret key | Yes |
| PAYSTACK_PUBLIC_KEY | Paystack public key | Yes |
| APP_BASE_URL | Backend URL | Yes |
| FRONTEND_URL | Frontend URL | Yes |

## CI/CD with GitHub Actions (Optional)

Create `.github/workflows/heroku-deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "expaq-api"
          heroku_email: "your-email@example.com"
```

## Important Notes

1. **Free Tier Limitations**:
   - App sleeps after 30 minutes of inactivity
   - Limited to 1000 dyno hours per month
   - Database limited to 10,000 rows

2. **Production Recommendations**:
   - Upgrade to paid dynos for always-on availability
   - Use Heroku Postgres Standard plan for production
   - Enable SSL certificates
   - Set up monitoring with New Relic or similar

3. **Security**:
   - Never commit sensitive data to Git
   - Use strong, unique values for all secrets
   - Enable 2FA on Heroku account
   - Regularly update dependencies

## Support Resources

- Heroku Dev Center: https://devcenter.heroku.com/
- Heroku Status: https://status.heroku.com/
- Spring Boot on Heroku: https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku

## Next Steps

After successful deployment:
1. Update your frontend to point to the Heroku backend URL
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Configure auto-scaling rules
5. Implement CI/CD pipeline

---

**Deployment Checklist:**
- [ ] Heroku CLI installed
- [ ] Heroku account created
- [ ] Application created on Heroku
- [ ] PostgreSQL addon added
- [ ] Environment variables configured
- [ ] Code pushed to Heroku
- [ ] Application running successfully
- [ ] Database connected and working
- [ ] Health endpoint responding
- [ ] Frontend connected to backend