# EchoVeil

> Speak freely. Stay unseen.

EchoVeil is a privacy-first anonymous messaging platform built to enable honest and secure communication without revealing the sender's identity.

The Node.js backend is currently under development, followed by a Flutter mobile application.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- Node.js Crypto
- JWT
- Google OAuth

### Mobile — Planned

- Flutter
- Dart

## Current Features

- User registration
- Secure password hashing with bcrypt
- Sensitive-data encryption
- User login
- User profile retrieval
- MongoDB integration
- JWT authentication
- Protected user profile endpoint
- Role based authorization
-Google Authentication

## API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/users/signUp`  | Create a new account                 |
| POST   | `/users/login`   | Log in and receive an access token   |
| GET    | `/users/profile` | Get the authenticated user's profile |

## Authentication

Protected endpoints require a JWT access token.

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Use `POST /users/login` to receive an `accessToken`.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## Roadmap

- [x] Backend project setup
- [x] User registration
- [x] Password hashing
- [x] Sensitive-data encryption
- [ ] Request validation
- [ ] JWT authentication
- [ ] Authorization
- [ ] Anonymous messaging
- [ ] Account confirmation
- [ ] Flutter mobile application
- [ ] Backend and Flutter integration
- [ ] Production deployment

## Project Status

EchoVeil is actively under development.

## Author

Developed by Hussein Alswasy.
