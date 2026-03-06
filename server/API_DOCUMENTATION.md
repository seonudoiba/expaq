# Expaq API Documentation

## The Base URL
```
http://localhost:8081
```

## Authentication
All endpoints except those marked as "Public" require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
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
    "lastName": string,
    "displayName:string
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