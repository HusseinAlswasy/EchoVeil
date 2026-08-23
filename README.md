# EchoVeil

> Speak freely. Stay unseen.

EchoVeil is a privacy-first anonymous messaging backend designed for secure user communication without exposing sender identity. The project currently focuses on user authentication, authorization, and secure account management, with anonymous messaging features planned for future expansion.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Node.js Crypto
- Google OAuth 2.0
- CORS
- dotenv

### Planned Frontend / Mobile

- Flutter
- Dart

## Current Features

### User Management

- User registration with email and password
- Google-based signup and login using Google ID tokens
- User login with password verification
- User profile retrieval for authenticated users
- MongoDB-backed user storage
- User roles and provider tracking

### Security

- Password hashing using bcrypt
- Sensitive data encryption using AES-256-CBC
- JWT-based access token generation and verification
- Protected routes using authentication middleware
- Role-based authorization using user roles
- Secure handling of environment variables with dotenv

### API & Server Features

- Express server setup with JSON parsing and CORS enabled
- Health check endpoint
- Global error handling middleware
- Not-found route handling with custom error responses

## User Model Fields

The project stores user data with the following major fields:

- firstName
- lastName
- fullName (virtual field derived from first and last name)
- email
- password
- phone
- age
- gender
- provider
- role
- isConfirmed
- profileImage
- timestamps

## API Endpoints

| Method | Endpoint              | Description                                 |
| ------ | --------------------- | ------------------------------------------- |
| GET    | `/`                   | Server health check                         |
| POST   | `/users/signUp`       | Register a new user with email and password |
| POST   | `/users/signup/gmail` | Register or login using Google ID token     |
| POST   | `/users/login`        | Login with email and password               |
| GET    | `/users/profile`      | Get the authenticated user profile          |

## Authentication

Protected endpoints require a JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example login flow

1. Send a request to `POST /users/login`
2. Receive an `accessToken`
3. Attach it to protected requests
4. Access `GET /users/profile` after authentication

## Middleware

### Authentication Middleware

- Validates the bearer token
- Verifies JWT signature and payload
- Loads the authenticated user from the database
- Attaches the user to `req.user`

### Authorization Middleware

- Restricts access based on allowed roles
- Example: `authorization(["user"])`

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=32_bytes_key_for_aes_256
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm run dev
```

### Production start

```bash
npm start
```

## Project Status

This backend is currently in active development. The implemented features include authentication, authorization, Google login, password hashing, encryption, and user profile management. Future work includes anonymous messaging, validation, account confirmation, and mobile integration.

## Roadmap

- [x] Backend project setup
- [x] User registration
- [x] Password hashing
- [x] Sensitive-data encryption
- [x] JWT authentication
- [x] Role-based authorization
- [x] Google authentication
- [x] Protected user profile route
- [ ] Request validation
- [ ] Anonymous messaging
- [ ] Account confirmation
- [ ] Flutter mobile app integration
- [ ] Production deployment

## Author

Developed by Hussein Alswasy.
