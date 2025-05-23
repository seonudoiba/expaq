# Expaq API Documentation

## Base URL
```
http://localhost:8081
```

## Authentication
All endpoints except those marked as "Public" require a JWT token in the Authorization header:
```
Authorization: Bearer my_jwt_token
```

## Public Endpoints

### Authentication
#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": string,
    "email": string,
    "password": string,
    "firstName": string,
    "lastName": string
}
```
Response: `AuthResponse` with JWT token

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": string,
    "password": string
}
```
Response: `AuthResponse` with JWT token

#### Verify Email
```http
GET /api/auth/verify-email?token={token}
```
Response: 200 OK

#### Request Password Reset
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
    "email": string
}
```
Response: 200 OK

### Activities (Public Endpoints)
#### Get All Activities
```http
GET /api/activities
Query Parameters:
- location (optional): string
- type (optional): string
- minPrice (optional): number
- maxPrice (optional): number
```
Response: `List<ActivityDTO>`

#### Get Activity by ID
```http
GET /api/activities/{id}
```
Response: `ActivityDTO`

## Protected Endpoints

### User Management
#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```
Response: `UserDTO`

### Activities (Protected Endpoints)
#### Create Activity (HOST role required)
```http
POST /api/activities
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": string,
    "description": string,
    "location": string,
    "price": number,
    "category": string,
    "maxParticipants": number,
    "startDate": string (ISO date),
    "endDate": string (ISO date)
}
```
Response: `ActivityDTO`

#### Update Activity (HOST role required)
```http
PUT /api/activities/{activityId}
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": string,
    "description": string,
    "location": string,
    "price": number,
    "category": string,
    "maxParticipants": number,
    "startDate": string (ISO date),
    "endDate": string (ISO date)
}
```
Response: `ActivityDTO`

#### Delete Activity (HOST role required)
```http
DELETE /api/activities/{activityId}
Authorization: Bearer <token>
```
Response: 204 No Content

### File Management
#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: File
type: string (optional)
```
Response: `string` (file URL)

#### Upload Multiple Files
```http
POST /api/files/upload-multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: File[]
type: string (optional)
```
Response: `List<string>` (file URLs)

#### Get File
```http
GET /api/files/{fileId}
```
Response: `byte[]`

#### Delete File
```http
DELETE /api/files/{fileId}
Authorization: Bearer <token>
```
Response: 200 OK

### Reviews
#### Create Review
```http
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
    "activityId": UUID,
    "rating": number,
    "comment": string
}
```
Response: `ReviewResponse`

#### Update Review
```http
PUT /api/v1/reviews/{reviewId}
Authorization: Bearer <token>
Content-Type: application/json

{
    "rating": number,
    "comment": string
}
```
Response: `ReviewResponse`

### Role Management (ADMIN only)
#### Get All Roles
```http
GET /roles
Authorization: Bearer <token>
```
Response: `List<Role>`

#### Create Role
```http
POST /roles/create-new-role
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": string
}
```
Response: `string`

#### Assign Role to User
```http
POST /roles/assign-user-to-role
Authorization: Bearer <token>
Query Parameters:
- userId: UUID
- role: string (USER, HOST, ADMIN)
```
Response: `User`

## Data Types

### ActivityDTO
```typescript
{
    id: UUID;
    title: string;
    description: string;
    location: string;
    price: number;
    category: string;
    maxParticipants: number;
    startDate: string;
    endDate: string;
    hostId: UUID;
    images: string[];
    rating: number;
    reviewCount: number;
}
```

### UserDTO
```typescript
{
    id: UUID;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImage: string;
    enabled: boolean;
}
```

### ReviewResponse
```typescript
{
    id: UUID;
    activityId: UUID;
    userId: UUID;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}
```

### AuthResponse
```typescript
{
    token: string;
    user: UserDTO;
}
```

## Error Responses
All endpoints may return the following error responses:

- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource already exists
- 500 Internal Server Error: Server error

## Notes
1. All dates are in ISO 8601 format
2. All UUIDs are in standard UUID format
3. File uploads are limited to 10MB per file
4. JWT tokens expire after 1 hour
5. CORS is enabled for http://localhost:3000 

## Postman Testing Guide

### Setup
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection named "Expaq API"
3. Set up environment variables:
   - Click "Environments" → "Create New"
   - Add these variables:
     ```
     base_url: http://localhost:8081
     token: (leave empty, will be filled after login)
     ```

### Authentication Flow
1. **Register a new user**
   - Create new request
   - Method: POST
   - URL: {{base_url}}/api/auth/register
   - Body (raw JSON):
     ```json
     {
         "username": "testuser",
         "email": "test@example.com",
         "password": "password123",
         "firstName": "Test",
         "lastName": "User"
     }
     ```
   - Send request and copy the token from response

2. **Set up Authorization**
   - In your environment variables, set the `token` value to the JWT token received
   - For all subsequent requests, add Authorization header:
     - Key: `Authorization`
     - Value: `Bearer {{token}}`

### Testing Protected Endpoints
1. **Create Activity (HOST role required)**
   - Method: POST
   - URL: {{base_url}}/api/activities
   - Headers:
     - Authorization: Bearer {{token}}
     - Content-Type: application/json
   - Body (raw JSON):
     ```json
     {
         "title": "City Tour",
         "description": "Explore the city",
         "location": "New York",
         "price": 50.00,
         "category": "TOUR",
         "maxParticipants": 10,
         "startDate": "2024-03-20T10:00:00Z",
         "endDate": "2024-03-20T14:00:00Z"
     }
     ```

2. **Upload File**
   - Method: POST
   - URL: {{base_url}}/api/files/upload
   - Headers:
     - Authorization: Bearer {{token}}
   - Body (form-data):
     - Key: file (Type: File)
     - Key: type (Type: Text, Value: profile)

### Testing Public Endpoints
1. **Get All Activities**
   - Method: GET
   - URL: {{base_url}}/api/activities
   - Query Params (optional):
     - location: New York
     - minPrice: 10
     - maxPrice: 100

2. **Get Activity by ID**
   - Method: GET
   - URL: {{base_url}}/api/activities/{activityId}
   - Replace {activityId} with actual UUID

### Common Issues and Solutions
1. **401 Unauthorized**
   - Check if token is valid
   - Ensure token is properly formatted: `Bearer <token>`
   - Try logging in again to get a new token

2. **403 Forbidden**
   - Check if user has required role (HOST/ADMIN)
   - Verify token hasn't expired

3. **400 Bad Request**
   - Check request body format
   - Ensure all required fields are present
   - Verify data types match expected format

4. **File Upload Issues**
   - Ensure file size is under 10MB
   - Check if file type is supported
   - Verify multipart/form-data is used

### Postman Collection
You can import this collection to get started quickly:
```json
{
    "info": {
        "name": "Expaq API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Authentication",
            "item": [
                {
                    "name": "Register",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/api/auth/register",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"testuser\",\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\",\n    \"firstName\": \"Test\",\n    \"lastName\": \"User\"\n}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                },
                {
                    "name": "Login",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/api/auth/login",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                }
            ]
        }
    ]
}
```

### Tips for Testing
1. Use environment variables for dynamic values
2. Create test scripts to automate token handling
3. Use collection variables for common values
4. Set up pre-request scripts to handle authentication
5. Use test scripts to validate responses 

## Deployment Guide (Render)

### Prerequisites
1. A [Render](https://render.com) account
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)
3. PostgreSQL database (you can use Render's PostgreSQL service)

### Steps to Deploy

1. **Create a PostgreSQL Database on Render**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Choose a name (e.g., "expaq-db")
   - Select your preferred region
   - Choose a plan (Free tier available for development)
   - Click "Create Database"
   - Save the connection details (you'll need them later)

2. **Create a Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure the service:
     ```
     Name: expaq-api
     Environment: Java
     Build Command: ./mvnw clean package -DskipTests
     Start Command: java -jar target/expaq-0.0.1-SNAPSHOT.jar
     ```

3. **Configure Environment Variables**
   Add these environment variables in Render's dashboard:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
   SPRING_DATASOURCE_USERNAME=your-db-username
   SPRING_DATASOURCE_PASSWORD=your-db-password
   APP_JWT_SECRET=your-jwt-secret
   APP_JWT_EXPIRATION=3600000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   MAIL_SMTP_HOST=smtp.gmail.com
   MAIL_SMTP_PORT=587
   MAIL_SMTP_USERNAME=your-email
   MAIL_SMTP_PASSWORD=your-app-password
   ```

4. **Update application.properties**
   Create a new file `src/main/resources/application-prod.properties`:
   ```properties
   # Production Database Configuration
   spring.datasource.url=${SPRING_DATASOURCE_URL}
   spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
   spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
   
   # JWT Configuration
   app.jwt.secret=${APP_JWT_SECRET}
   app.jwt.expiration-in-ms=${APP_JWT_EXPIRATION}
   
   # Cloudinary Configuration
   cloudinary.cloud.name=${CLOUDINARY_CLOUD_NAME}
   cloudinary.api.key=${CLOUDINARY_API_KEY}
   cloudinary.api.secret=${CLOUDINARY_API_SECRET}
   
   # SMTP Configuration
   mail.smtp.host=${MAIL_SMTP_HOST}
   mail.smtp.port=${MAIL_SMTP_PORT}
   mail.smtp.username=${MAIL_SMTP_USERNAME}
   mail.smtp.password=${MAIL_SMTP_PASSWORD}
   
   # Other Production Settings
   spring.jpa.hibernate.ddl-auto=validate
   spring.jpa.show-sql=false
   logging.level.org.springframework=INFO
   ```

5. **Update pom.xml**
   Add the following to your `pom.xml`:
   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
               <configuration>
                   <excludes>
                       <exclude>
                           <groupId>org.projectlombok</groupId>
                           <artifactId>lombok</artifactId>
                       </exclude>
                   </excludes>
               </configuration>
           </plugin>
       </plugins>
   </build>
   ```

6. **Deploy**
   - Render will automatically deploy your application when you push to your repository
   - You can also manually deploy from the Render dashboard
   - Monitor the deployment logs for any issues

### Important Notes
1. **Database**
   - Free tier PostgreSQL on Render has some limitations
   - Consider upgrading for production use
   - Backup your database regularly

2. **Environment Variables**
   - Never commit sensitive information to your repository
   - Use Render's environment variables for all sensitive data
   - Keep your JWT secret secure

3. **Scaling**
   - Render automatically scales your application
   - Monitor your usage to stay within free tier limits
   - Consider upgrading for better performance

4. **Monitoring**
   - Use Render's dashboard to monitor your application
   - Set up alerts for errors
   - Monitor database connections

5. **CORS Configuration**
   Update your CORS configuration in `SecurityConfig.java`:
   ```java
   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration configuration = new CorsConfiguration();
       configuration.setAllowedOrigins(Arrays.asList(
           "https://your-frontend-domain.com",
           "http://localhost:3000"
       ));
       configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
       configuration.setAllowedHeaders(Arrays.asList("*"));
       configuration.setExposedHeaders(Arrays.asList("Authorization"));
       configuration.setAllowCredentials(true);
       
       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
       source.registerCorsConfiguration("/**", configuration);
       return source;
   }
   ```

### Troubleshooting
1. **Application Won't Start**
   - Check environment variables
   - Verify database connection
   - Check build logs

2. **Database Connection Issues**
   - Verify database credentials
   - Check if database is running
   - Ensure IP whitelist includes Render's IPs

3. **Memory Issues**
   - Monitor memory usage
   - Consider upgrading plan
   - Optimize application

4. **Deployment Failures**
   - Check build logs
   - Verify Maven configuration
   - Ensure all dependencies are available 
