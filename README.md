# my-app

Node + Express MVC scaffold with authentication (JWT access + refresh tokens), role-based access, and protected routes.

## Features
- Register / Login / Logout
- Access token (short-lived) + Refresh token (httpOnly cookie)
- Protected routes and role-based authorization
- MongoDB (Mongoose)

## Quickstart
1. Copy `.env.example` to `.env` and set values.
2. `npm install`
3. `npm run dev`

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET  `/api/auth/refresh`
- GET  `/api/users/me` (protected)
- GET  `/api/users` (protected, admin only)
