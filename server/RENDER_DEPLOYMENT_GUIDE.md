# Render Deployment Guide

## Prerequisites
1. A Render account (sign up at [render.com](https://render.com))
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database (can be created on Render)

## Steps to Deploy

### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: expaq-db
   - Database: expaq
   - User: (auto-generated)
   - Region: Choose closest to your users
4. Click "Create Database"
5. Save the connection details (you'll need them later)

### 2. Create Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   ```
   Name: expaq
   Environment: Java
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar target/expaq-0.0.1-SNAPSHOT.jar
   ```

### 3. Configure Environment Variables
Add these environment variables in Render dashboard:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<your-db-host>:5432/expaq
SPRING_DATASOURCE_USERNAME=<your-db-username>
SPRING_DATASOURCE_PASSWORD=<your-db-password>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
JWT_SECRET=<your-secure-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
SMTP_HOST=<your-smtp-host>
SMTP_PORT=587
SMTP_USERNAME=<your-smtp-username>
SMTP_PASSWORD=<your-smtp-password>
```

### 4. Update application.properties
Ensure your `application.properties` uses environment variables:
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}
spring.jpa.properties.hibernate.dialect=${SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT}

jwt.secret=${JWT_SECRET}

cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

spring.mail.host=${SMTP_HOST}
spring.mail.port=${SMTP_PORT}
spring.mail.username=${SMTP_USERNAME}
spring.mail.password=${SMTP_PASSWORD}
```

### 5. Update pom.xml
Ensure your `pom.xml` has the correct Java version and dependencies:
```xml
<properties>
    <java.version>17</java.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 6. Deploy
1. Push your changes to Git
2. Render will automatically:
   - Pull your code
   - Build the application
   - Deploy it
3. Monitor the deployment in Render dashboard

## Important Notes

### Database
- Free tier PostgreSQL has limitations:
  - 1GB storage
  - 90-day retention
  - Limited connections
- Consider upgrading for production

### Environment Variables
- Never commit sensitive data to Git
- Use Render's environment variable feature
- Rotate secrets regularly

### Scaling
- Free tier: 750 hours/month
- Auto-sleep after 15 minutes of inactivity
- Upgrade for:
  - Always-on service
  - More resources
  - Custom domains

### Monitoring
- View logs in Render dashboard
- Set up alerts for:
  - Failed deployments
  - High error rates
  - Resource usage

### CORS Configuration
Update your security config to allow your frontend domain:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("https://your-frontend-domain.com"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## Troubleshooting

### Application Won't Start
1. Check logs in Render dashboard
2. Verify environment variables
3. Ensure database is accessible
4. Check Java version compatibility

### Database Connection Issues
1. Verify database credentials
2. Check if database is running
3. Ensure IP allowlist includes Render's IPs
4. Verify database URL format

### Memory Issues
1. Check application logs for OOM errors
2. Adjust JVM memory settings:
   ```
   java -Xmx512m -jar target/expaq-0.0.1-SNAPSHOT.jar
   ```
3. Consider upgrading service tier

### Deployment Failures
1. Check build logs
2. Verify Maven configuration
3. Ensure all dependencies are available
4. Check for compilation errors

## Best Practices
1. Use environment variables for configuration
2. Implement proper logging
3. Set up health check endpoints
4. Use database migrations
5. Implement proper error handling
6. Set up monitoring and alerts
7. Regular security updates
8. Backup strategy for database 