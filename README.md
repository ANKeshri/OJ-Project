# MERN Authentication System

A full-stack authentication system built with MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
├── backend/           # Backend server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/oj_project
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

## Accessing the Application

- Backend API: http://localhost:5000
- Frontend Application: http://localhost:3000

## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Form Validation
- Responsive Design
- Modern UI with Tailwind CSS

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

## Technologies Used

- Frontend:
  - React.js
  - React Router
  - Axios
  - Tailwind CSS

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT
  - bcryptjs 