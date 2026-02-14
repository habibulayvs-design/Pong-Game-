# Complete Website Architecture

This document provides a comprehensive overview of the website architecture project.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Layout/
│   │   │   ├── Posts/
│   │   │   └── UI/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── utils/
│   │   └── helpers.js
│   ├── config/
│   │   └── db.js
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── docs/
│   ├── api-endpoints.md
│   ├── database-schema.md
│   └── authentication-flow.md
└── README.md
```

## Frontend Stack

### Core Technologies
- **React.js**: Component-based UI library
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests

### Additional Libraries
- **Prop Types**: Runtime type checking
- **Tailwind CSS**: Utility-first CSS framework (to be added)

### Key Features
- Component-based architecture
- Client-side routing with protected routes
- State management ready (using React hooks)
- Responsive design foundation
- Modular service layer for API communication

## Backend Stack

### Core Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Document Mapper)

### Authentication & Security
- **JWT**: Stateless authentication tokens
- **Bcrypt**: Password hashing
- **Helmet**: Security HTTP headers
- **CORS**: Cross-Origin Resource Sharing

### Validation & Utilities
- **Express Validator**: Input validation
- **Dotenv**: Environment variable management
- **Nodemon**: Development auto-restart (dev dependency)

## Database Schema

The database follows a normalized structure with relationships between entities:

### Users Collection
- Core user information (credentials, personal details)
- Role-based access control
- Account status management

### Posts Collection
- Content creation and management
- Relationship with authors
- Categorization and tagging
- Publishing workflow (draft/published/archived)

### Comments Collection
- Hierarchical commenting system
- Relationship with posts and users
- Like functionality

## API Endpoints

The API follows RESTful principles with consistent response formatting:

### Response Format
```json
{
  "success": true,
  "data": {}
}
```

### Endpoint Categories
1. **Authentication**: Registration, login, profile management
2. **Content**: Posts creation, retrieval, modification
3. **Interaction**: Comments, likes
4. **Administration**: User management (admin only)

## Authentication Flow

The authentication system implements industry-standard practices:

### Registration Process
1. Client validates input
2. Server validates and sanitizes data
3. Password hashing with bcrypt
4. User creation and JWT generation
5. Token transmission to client

### Login Process
1. Credential validation
2. Password comparison using bcrypt
3. JWT generation with user claims
4. Token transmission to client

### Token Management
- JWT tokens with configurable expiration
- Middleware for token validation
- Role-based access control
- Secure token storage considerations

### Security Measures
- Password hashing with salt
- Input validation and sanitization
- Rate limiting (implementation ready)
- CORS policy enforcement
- Security headers with Helmet