# GEMINI.md

## Project Overview
This project, `prueba-1-bcrypt`, is a Node.js-based environment for practicing password hashing and authentication using `bcrypt`. It demonstrates how to securely hash passwords and verify them against plain-text inputs. The project also includes dependencies for `express` and `passport`, indicating potential for expansion into a full web application with authentication.

### Main Technologies
- **Node.js**: The runtime environment.
- **bcrypt**: Used for password hashing and verification.
- **Express**: (Dependency) A web framework for Node.js.
- **Passport**: (Dependency) Authentication middleware for Node.js.

## Building and Running

### Prerequisites
- Node.js and npm installed.

### Installation
```bash
npm install
```

### Running the Demo Script
The project includes a script named `playground.js` that demonstrates the core bcrypt functionality (loading a password, hashing it, and comparing it).
```bash
node playground.js
```

### Testing
Currently, no specific tests are defined.
```bash
npm test
```

## Project Structure
- `package.json`: Contains project metadata and dependencies.
- `playground.js`: The main entry point for demonstrating bcrypt usage.
- `contraseña-text-plano.txt`: A sample text file containing a plain-text password used by `playground.js`.

## Development Conventions
- **Module System**: Uses **CommonJS** (`require`).
- **Asynchronous Code**: Uses **async/await** for file operations and bcrypt functions.
- **Coding Style**: Follows standard JavaScript practices for small Node.js projects.
- **Security**: Focuses on password hashing best practices using a salt round of 10 (as seen in `playground.js`).
