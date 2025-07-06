# Online Judge (OJ) Platform

A full-stack online coding platform built with the MERN stack, featuring real-time code compilation, problem management, and user authentication. This platform allows users to solve coding problems, test their solutions, and track their progress.

## 🚀 Features

### Core Functionality
- **Multi-language Code Compilation**: Support for C++, Java, and Python
- **Real-time Code Execution**: Instant feedback on code submissions
- **Problem Management**: Curated collection of coding problems with test cases
- **User Authentication**: Secure login/signup with JWT and Google OAuth
- **Interactive Code Editor**: Syntax highlighting and language-specific templates
- **Test Case Validation**: Sample and hidden test cases for comprehensive evaluation
- **Submission Tracking**: Detailed results and performance feedback

### User Experience
- **Modern UI/UX**: Clean, responsive design with dark theme
- **Real-time Feedback**: Toast notifications for successful/failed submissions
- **Problem Categories**: Easy navigation through different problem types
- **Profile Management**: User profiles with LeetCode integration
- **Progress Tracking**: Visual indicators for problem completion status

## 🏗️ Architecture

The project follows a microservices architecture with three main components:

```
├── frontend/          # React.js SPA with Vite
├── backend/           # Express.js API server
└── compiler/          # Code execution microservice
```

### Technology Stack

#### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Heroicons** - Beautiful SVG icons
- **Google OAuth** - Social authentication

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Google Auth Library** - OAuth integration

#### Compiler Service
- **Child Process** - Code execution in isolated environment
- **File System** - Temporary file management
- **UUID** - Unique file generation
- **Multi-language Support** - C++, Java, Python compilation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- C++ compiler (g++)
- Java Development Kit (JDK)
- Python (v3.8 or higher)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OJ_Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/oj_platform
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your_google_client_id
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Compiler Service Setup**
   ```bash
   cd compiler
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Start the Compiler Service**
   ```bash
   cd compiler
   node index.js
   # Compiler runs on http://localhost:3001
   ```

4. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

### Database Seeding

To populate the database with sample problems:

```bash
cd backend
node scripts/seedProblems.js
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `GET /api/problems/:id/testcases` - Get sample test cases
- `POST /api/problems/:id/run` - Run code on sample test cases
- `POST /api/problems/:id/submit` - Submit code for all test cases

### Compiler
- `POST /compiler/run` - Execute code with custom input

## 🎯 Problem Structure

Each problem includes:
- **Title & Description**: Clear problem statement
- **Constraints**: Input/output limitations
- **Sample Test Cases**: Visible examples for understanding
- **Hidden Test Cases**: Comprehensive validation
- **Difficulty Levels**: Easy, Medium, Hard categorization

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment Configuration**
   - Set production environment variables
   - Configure MongoDB Atlas for cloud database
   - Set up proper CORS origins

3. **Deploy Services**
   - Deploy backend to cloud platform (Heroku, AWS, etc.)
   - Deploy compiler service to separate instance
   - Serve frontend build files

### Docker Support

The application can be containerized using Docker:

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing
- Test code compilation for all supported languages
- Verify authentication flows
- Test problem submission and validation
- Check responsive design across devices

### Automated Testing
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm test
```

## 📊 Performance Considerations

- **Code Execution Isolation**: Each submission runs in isolated environment
- **File Cleanup**: Temporary files are automatically cleaned up
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Implement Redis for session management (future enhancement)

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user code editing
- **Leaderboards**: User rankings and achievements
- **Contest System**: Timed coding competitions
- **Code Analysis**: Performance metrics and optimization suggestions
- **Mobile App**: React Native application
- **Advanced IDE**: Monaco Editor integration
- **Discussion Forum**: Problem-specific discussions
- **Admin Panel**: Problem management interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React.js, Tailwind CSS, Vite
- **Backend Developer**: Node.js, Express.js, MongoDB
- **DevOps Engineer**: Deployment, CI/CD, Infrastructure

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using the MERN Stack** 