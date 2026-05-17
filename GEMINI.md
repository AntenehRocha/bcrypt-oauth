# GEMINI.md

## Project Overview
This project, `prueba-1-bcrypt`, is a Node.js-based environment for practicing password hashing and authentication using `bcrypt`. It has evolved from a simple demo script into a functional web application with authentication.

### Main Technologies
- **Node.js**: The runtime environment.
- **bcrypt**: Used for password hashing and verification.
- **Express**: Web framework for the authentication server.
- **Passport & Passport-Local**: Middleware for handling user authentication.
- **Express-Session**: Used for session management.

## Building and Running

### Prerequisites
- Node.js and npm installed.

### Installation
```bash
npm install
```

### Running the Application
The main application is now an Express server in `index.js`.
```bash
node index.js
```
The server will start on `http://localhost:3000`.

### Running the Legacy Demo Script
The original `playground.js` script is still available for demonstrating core bcrypt functionality.
```bash
node playground.js
```

### Testing
Currently, no automated tests are defined.
```bash
npm test
```

## Project Structure
- `package.json`: Contains project metadata and dependencies.
- `index.js`: The main Express server with authentication logic.
- `playground.js`: A standalone script for bcrypt practice.
- `contraseña-text-plano.txt`: A sample text file used by `playground.js`.

## Development Conventions
- **Module System**: Uses **CommonJS** (`require`).
- **Asynchronous Code**: Uses **async/await** for file operations, bcrypt hashing, and database lookups.
- **Security**:
  - Passwords are never stored in plain text; they are hashed with a salt round of 10.
  - Authentication is managed via `passport-local`.
  - Routes like `/profile` are protected using `ensureAuthenticated` middleware.
