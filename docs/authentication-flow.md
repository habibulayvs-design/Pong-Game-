# Authentication Flow

This document describes the authentication system implemented in the website architecture project.

## Overview

The authentication system uses JSON Web Tokens (JWT) for stateless authentication. The flow involves registration, login, token validation, and logout processes.

## Registration Process

1. User submits registration form with:
   - First name
   - Last name
   - Username
   - Email
   - Password

2. Server validates input data:
   - Checks for required fields
   - Validates email format
   - Ensures username and email are unique
   - Verifies password strength

3. If validation passes:
   - Password is hashed using bcrypt
   - New user document is created in database
   - JWT token is generated with user ID and role
   - Token and user data are returned to client

4. Client stores JWT token (typically in localStorage or sessionStorage)

## Login Process

1. User submits login form with:
   - Email
   - Password

2. Server validates credentials:
   - Finds user by email
   - Compares provided password with hashed password using bcrypt

3. If credentials are valid:
   - JWT token is generated with user ID and role
   - Token and user data are returned to client

4. If credentials are invalid:
   - Returns 401 Unauthorized error

## Token Generation

JWT tokens are generated with the following payload:
```javascript
{
  userId: ObjectId (user's database ID),
  email: String (user's email),
  role: String (user's role: 'user' or 'admin'),
  iat: Number (issued at timestamp),
  exp: Number (expiration timestamp)
}
```

Token configuration:
- Expiration: 24 hours (configurable)
- Algorithm: HS256
- Secret: Stored in environment variables

## Token Validation

For protected routes:

1. Client includes JWT in Authorization header:
   ```
   Authorization: Bearer <token>
   ```

2. Server middleware extracts token from header

3. Token is verified using JWT library:
   - Checks signature validity
   - Verifies expiration
   - Decodes user information

4. If valid, user information is attached to request object
   - req.user = { userId, email, role }

5. If invalid, returns 401 Unauthorized error

## Session Management

### Client-Side
- JWT tokens are stored in browser storage
- Tokens are included in headers for authenticated requests
- On logout, tokens are removed from storage

### Server-Side
- No server-side session storage (stateless)
- Tokens are validated on each request to protected routes
- Optional: Sessions collection to track active sessions

## Logout Process

1. Client removes JWT token from storage
2. Optionally, server invalidates token (if using refresh tokens or sessions collection)
3. User is redirected to login page

## Security Measures

1. **Password Hashing**: Using bcrypt with salt rounds to securely store passwords
2. **Input Validation**: Comprehensive validation of all user inputs
3. **Rate Limiting**: Prevents brute force attacks (implemented via middleware)
4. **JWT Security**: Proper secret management and token expiration
5. **HTTPS**: All authentication requests should be over HTTPS in production
6. **CORS Policy**: Restricts cross-origin requests appropriately
7. **Helmet**: Implements various security headers

## Middleware Implementation

### Authentication Middleware (`authMiddleware`)
- Extracts token from Authorization header
- Verifies token validity
- Attaches user info to request object
- Handles unauthorized access

### Role-Based Access Control (`requireRole`)
- Extends auth middleware
- Checks user role against required roles
- Allows access to role-specific endpoints

## Refresh Token Strategy (Optional Enhancement)

For extended user sessions, implement refresh tokens:

1. Login returns both access token (short-lived) and refresh token (longer-lived)
2. Access token expires quickly (e.g., 15 minutes)
3. When access token expires, client uses refresh token to get new access token
4. Refresh tokens are stored in database with user association
5. Refresh tokens can be invalidated independently

## Error Handling

Authentication errors include:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid credentials or token
- 403 Forbidden: Insufficient permissions
- 409 Conflict: Duplicate username/email during registration
- 500 Internal Server Error: Server issues during authentication

## Testing Considerations

Authentication flow should be tested for:
- Valid registration and login
- Invalid credentials
- Token expiration
- Missing or malformed tokens
- Role-based access restrictions
- Password reset functionality (if implemented)