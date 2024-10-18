## Project Overview
This project is an advanced authentication backend built using Node.js and Express. It provides a robust authentication system with features such as user registration, login, email verification, password recovery, and token-based authentication.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Nodemailer**: For sending emails (verification and password reset).
- **Bcrypt**: For password hashing.

## Features
- User registration with email verification.
- User login and logout functionality.
- Password recovery and reset.
- Token-based authentication for secure API access.
- Middleware for protecting routes.

## Setup
1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/advanced-auth-backend.git
   cd advanced-auth-backend
    ```
2. **Install dependencies:**
    ```
    npm install
    ```
3. **env file**
    ```
    MONGO_URI = 
    JWT_SECRET = 
    JWT_EXPIRE = 
    PORT = 
    NODE_ENV = 
    MAILTRAP_TOKEN = 
    CLIENT_URL =
    ```
