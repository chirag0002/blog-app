# Blog App

A basic blog application with user authentication, blog creation, and management functionalities.

## Table of Contents

- [Blog App](#blog-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [API Endpoints](#api-endpoints)
  - [Adding Authorization Token](#adding-authorization-token)

## Features

- User authentication with JWT
- User registration with password hashing
- Blog creation, retrieval, updating, and deletion
- Input validation for user and blog data
- Non authenticated users can read blog posts
- Only authenticated user can delete and update blogs which they created only

## Prerequisites

- Node.js and npm installed
- MongoDB database

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/blog-app.git
   ```

2. Install dependencies:

   ```bash
   cd blog-app
   npm install
   ```

3. Set up your MongoDB database and update the connection string for `database`.

4. Create a `.env` file in the project root with the following content:

   ```env
   PORT=your-port
   DB=your-mongodb-connection-string
   KEY=your-secret-key-for-jwt
   ```

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

- **POST /signup**
  - Create a new user account.

- **POST /signin**
  - Authenticate and sign in a user.

- **GET /blogs**
  - Get all blog posts.

- **GET /myBlogs**
  - Get blog posts created by the authenticated user.

- **GET /blogs/:id**
  - Get a specific blog post by ID.

- **POST /blogs**
  - Create a new blog post.
    - Requires Authorization Token in Headers (Key: Authorization).

- **PUT /blogs/:id**
  - Update a specific blog post by ID.
    - Requires Authorization Token in Headers (Key: Authorization).

- **DELETE /blogs/:id**
  - Delete a specific blog post by ID.
    - Requires Authorization Token in Headers (Key: Authorization).


## Adding Authorization Token

For `PUT`, `POST`, and `DELETE` requests, include an Authorization Token in the headers of your HTTP request with the key `Authorization` which you will get in response at the time of `signin`

Example:

```plaintext
Key: Authorization
Value: your-jwt-token
```

---
