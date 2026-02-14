# API Endpoints

This document describes all the API endpoints available in the backend service.

## Base URL
All API endpoints are prefixed with `/api/v1/`

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)", 
  "username": "string (required, unique)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

**Response:**
- Success (201): Created user object with JWT token
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "createdAt": "date"
    },
    "token": "JWT token"
  }
}
```
- Validation Error (400): Error details
- Conflict (409): Username or email already exists

### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- Success (200): User object with JWT token
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "token": "JWT token"
  }
}
```
- Unauthorized (401): Invalid credentials

### POST /auth/logout
Invalidate user session (optional endpoint depending on client-side token handling).

**Headers:**
- Authorization: Bearer [token]

**Response:**
- Success (200): Logout confirmation

### GET /auth/profile
Get authenticated user profile information.

**Headers:**
- Authorization: Bearer [token]

**Response:**
- Success (200): User object
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string (URL)",
      "role": "string",
      "isActive": "boolean",
      "createdAt": "date"
    }
  }
}
```
- Unauthorized (401): Invalid or expired token

### PUT /auth/profile
Update authenticated user profile information.

**Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "username": "string (optional)",
  "email": "string (optional)",
  "avatar": "string (optional, URL)"
}
```

**Response:**
- Success (200): Updated user object
- Validation Error (400): Error details
- Conflict (409): Username or email already exists

## Posts Endpoints

### GET /posts
Retrieve list of posts with pagination support.

**Query Parameters:**
- page: integer (default: 1)
- limit: integer (default: 10, max: 50)
- category: string (optional)
- search: string (optional, search in title/content)
- status: string (optional, filter by status)

**Response:**
- Success (200): Paginated list of posts
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "ObjectId",
        "title": "string",
        "content": "string (truncated)",
        "author": {
          "_id": "ObjectId",
          "username": "string",
          "firstName": "string",
          "lastName": "string"
        },
        "category": "string",
        "tags": ["string"],
        "status": "string",
        "views": "number",
        "likesCount": "number",
        "commentsCount": "number",
        "publishedAt": "date",
        "createdAt": "date"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "hasNext": "boolean",
      "hasPrev": "boolean"
    }
  }
}
```

### GET /posts/:id
Retrieve a specific post by ID.

**Parameters:**
- id: ObjectId (required)

**Response:**
- Success (200): Post object
- Not Found (404): Post does not exist

### POST /posts
Create a new post.

**Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "category": "string (optional)",
  "tags": ["string"] (optional),
  "status": "string ('draft' or 'published', default: 'draft')"
}
```

**Response:**
- Success (201): Created post object
- Unauthorized (401): Invalid token
- Validation Error (400): Error details

### PUT /posts/:id
Update an existing post.

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- id: ObjectId (required)

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "category": "string (optional)",
  "tags": ["string"] (optional),
  "status": "string ('draft', 'published', 'archived')"
}
```

**Response:**
- Success (200): Updated post object
- Unauthorized (401): Invalid token or not owner
- Forbidden (403): Not authorized to edit this post
- Not Found (404): Post does not exist

### DELETE /posts/:id
Delete a post.

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- id: ObjectId (required)

**Response:**
- Success (200): Deletion confirmation
- Unauthorized (401): Invalid token or not owner
- Forbidden (403): Not authorized to delete this post
- Not Found (404): Post does not exist

## Comments Endpoints

### GET /posts/:postId/comments
Retrieve comments for a specific post.

**Parameters:**
- postId: ObjectId (required)

**Response:**
- Success (200): List of comments
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "ObjectId",
        "content": "string",
        "author": {
          "_id": "ObjectId",
          "username": "string",
          "firstName": "string",
          "lastName": "string"
        },
        "parentComment": "ObjectId or null",
        "likesCount": "number",
        "createdAt": "date"
      }
    ]
  }
}
```

### POST /posts/:postId/comments
Add a comment to a post.

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- postId: ObjectId (required)

**Request Body:**
```json
{
  "content": "string (required)",
  "parentComment": "ObjectId (optional, for nested replies)"
}
```

**Response:**
- Success (201): Created comment object
- Unauthorized (401): Invalid token
- Validation Error (400): Error details

### POST /comments/:commentId/like
Like a comment.

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- commentId: ObjectId (required)

**Response:**
- Success (200): Like confirmation
- Unauthorized (401): Invalid token

### DELETE /comments/:commentId/like
Unlike a comment.

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- commentId: ObjectId (required)

**Response:**
- Success (200): Unlike confirmation
- Unauthorized (401): Invalid token

## User Management Endpoints (Admin Only)

### GET /users
Retrieve list of users (admin only).

**Headers:**
- Authorization: Bearer [token]

**Query Parameters:**
- page: integer (default: 1)
- limit: integer (default: 10, max: 50)
- role: string (optional, filter by role)
- active: boolean (optional, filter by active status)

**Response:**
- Success (200): Paginated list of users
- Unauthorized (401): Invalid token
- Forbidden (403): Insufficient permissions

### PUT /users/:userId
Update user information (admin only or own profile).

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- userId: ObjectId (required)

**Request Body:**
```json
{
  "role": "string ('user' or 'admin', admin only)",
  "isActive": "boolean (admin only)"
}
```

**Response:**
- Success (200): Updated user object
- Unauthorized (401): Invalid token
- Forbidden (403): Insufficient permissions
- Not Found (404): User does not exist

### DELETE /users/:userId
Deactivate a user account (admin only).

**Headers:**
- Authorization: Bearer [token]

**Parameters:**
- userId: ObjectId (required)

**Response:**
- Success (200): Deactivation confirmation
- Unauthorized (401): Invalid token
- Forbidden (403): Insufficient permissions
- Not Found (404): User does not exist