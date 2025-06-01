# Blog Backend

A simple Node.js, Express, and Prisma backend for a blogging platform with JWT authentication.

## Features

- User authentication (signup, signin, signout) with JWT
- CRUD operations for blog posts and comments
- PostgreSQL database with Prisma ORM
- Protected routes for authenticated users
- CORS and cookie support

## API Endpoints

- `POST /api/v1/user/signup` — Register a new user
- `POST /api/v1/user/signin` — Login and receive JWT
- `POST /api/v1/user/signout` — Logout
- `GET /api/v1/blog/` — Get all posts (auth required)
- `POST /api/v1/blog/` — Create a post (auth required)
- `PUT /api/v1/blog/:id` — Edit a post (auth required)
- `DELETE /api/v1/blog/:id` — Delete a post (auth required)

### Unauthenticated Routes

- `GET /api/v1/home/blog` — Get all public posts
- `GET /api/v1/home/blog/:id` — Get a single public post
- `GET /api/v1/home/blog/:id/comments` — Get comments for a post
- `POST /api/v1/home/blog/:id/comments` — Add a comment to a post