# EchoVeil

> Speak freely. Stay unseen.

EchoVeil is a privacy-first anonymous messaging backend built with Node.js and Express. It focuses on secure user management, token-based authentication, OTP verification, and future anonymous communication features.

## Overview

This project provides a REST API for:

- User registration and login
- Email OTP verification and resend flow
- Password reset flow
- Google-based authentication
- User profile management
- Role-based access control
- Redis-backed OTP limits and expiry
- MongoDB persistence for users and related data

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- JWT
- bcrypt
- Nodemailer
- Google OAuth 2.0
- Cloudinary
- Multer
- Joi
- dotenv

## Features

### Authentication

- Email and password signup
- System login with JWT generation
- Access and refresh token handling
- Google sign-up/sign-in via ID token verification
- Password reset and OTP flows

### Security

- Password hashing with bcrypt
- Sensitive field encryption using AES-256-CBC
- Role-based authorization middleware
- Protected routes with JWT verification
- OTP rate limiting and block logic via Redis

### User Management

- User profile retrieval and updates
- Email confirmation flow
- Resend OTP support
- User provider tracking for local and Google accounts

### API & Server

- Express app initialization
- JSON parsing and CORS support
- Error middleware
- Not-found route handling
- Health check endpoint

## Environment Variables

Create a .env file in the project root with the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ENCRYPTION_KEY=32_characters_or_64_for_key
EMAIL_ADDRESS=your_gmail_address
EMAIL_PASSWORD=your_app_password
REDIS_URL=your_redis_connection_url
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the project in development mode:

```bash
npm run dev
```

3. Start the production server:

```bash
npm start
```

## API Routes

### Auth and User

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | /                      | Server health check             |
| POST   | /users/signUp          | Register a new account          |
| POST   | /users/signup/gmail    | Register or sign in with Google |
| POST   | /users/login           | Login with email and password   |
| POST   | /users/resend-otp      | Send a new OTP                  |
| PATCH  | /users/confirmEmail    | Confirm email with OTP          |
| PATCH  | /users/forget_password | Send reset OTP                  |
| PATCH  | /users/reset_password  | Reset password                  |
| GET    | /users/profile         | Get current authenticated user  |

## Basic Usage Flow

1. Sign up with email and password.
2. Receive an OTP email.
3. Confirm the email using the OTP endpoint.
4. Login with the same email and password.
5. Use the access token in the Authorization header for protected routes.

Example:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Project Status

The backend is under active development. Core auth, email verification, password reset, Google login, and profile APIs are implemented.

## Roadmap

- [x] Project setup
- [x] User signup and login
- [x] Email OTP verification
- [x] Password reset flow
- [x] JWT auth and refresh tokens
- [x] Google authentication
- [x] User profile and update endpoints
- [x] Redis-based OTP handling
- [ ] Anonymous messaging features
- [ ] Full validation hardening
- [ ] Mobile app integration
- [ ] Deployment setup

## Repository

GitHub remote is configured and points to:
https://github.com/HusseinAlswasy/EchoVeil.git

## Author

Hussein Alswasy
