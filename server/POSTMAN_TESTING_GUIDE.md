# Postman Testing Guide

## Setup
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection named "Expaq API"
3. Set up environment variables:
   - Click "Environments" → "Create New"
   - Add these variables:
     ```
     base_url: http://localhost:8081
     token: (leave empty, will be filled after login)
     ```

## Authentication Flow
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

## Testing Protected Endpoints
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

## Testing Public Endpoints
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

## Common Issues and Solutions
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

## Postman Collection
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

## Tips for Testing
1. Use environment variables for dynamic values
2. Create test scripts to automate token handling
3. Use collection variables for common values
4. Set up pre-request scripts to handle authentication
5. Use test scripts to validate responses 