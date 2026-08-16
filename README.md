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

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/signUp` | Create a new account |
| POST | `/users/login` | Log in to an account |
| GET | `/users/profile/:id` | Get a user profile |

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