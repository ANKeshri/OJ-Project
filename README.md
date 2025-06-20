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


3. Start the backend server:
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