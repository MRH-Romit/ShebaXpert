# ShebaXpert - Service Provider Platform

ShebaXpert is a comprehensive service provider platform built with Node.js backend and vanilla HTML/CSS/JavaScript frontend, featuring MySQL-based authentication and user management.

## Quick Start

To start the application, simply run:

```powershell
.\quick-start.ps1
```

This script will:
- Install backend dependencies automatically
- Start the backend server on port 5000
- Start the frontend server on port 8080
- Open the application in your browser

## Project Structure

```
ShebaXpert/
├── backend/                 # Node.js Express server
│   ├── config/             # Database and API configurations
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   ├── schema.sql         # MySQL database schema
│   └── .env               # Environment configuration
├── Dashboard/             # User dashboard interface
├── Landing Page/          # Main landing page
├── Login/                # Authentication interface
├── Resources/            # Static assets (images, etc.)
└── quick-start.ps1      # Application startup script
```

## Features

- **MySQL Authentication System**: Secure user registration and login
- **RESTful API**: Complete backend API for user management
- **Responsive UI**: Modern, mobile-friendly interface
- **Dashboard**: User profile and service management
- **Service Provider Integration**: Connect with various service providers
- **Real-time Notifications**: User notification system

## Prerequisites

- Node.js (v16 or higher)
- Python (for static file server)
- MySQL Server
- PowerShell (Windows)

## Quick Start

### 1. Database Setup

1. Install and start MySQL server
2. Create database credentials and update `backend/.env`:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=shebaxpert
   JWT_SECRET=your_jwt_secret
   ```

3. Run database setup:
   ```bash
   cd backend
   node createMySQLDatabase.js
   ```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start Application

Run the comprehensive startup script:
```powershell
.\start-all.ps1
```

This script will:
- Check for required dependencies
- Install missing packages
- Start the backend API server (port 5000)
- Start the frontend server (port 8080)
- Open the application in your browser

### Manual Start (Alternative)

If you prefer to start services manually:

```bash
# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd ..
python -m http.server 8080

# Open browser
# Navigate to: http://localhost:8080/Landing%20Page/LandingPage.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Services
- `GET /api/services` - Get available services
- `POST /api/services` - Create service request
- `GET /api/services/:id` - Get specific service

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id` - Mark notification as read

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
The frontend uses vanilla HTML/CSS/JavaScript. Simply edit files and refresh the browser.

### Database Schema
The database schema is defined in `backend/schema.sql`. To reset the database:
```bash
cd backend
node createMySQLDatabase.js
```

## Configuration

### Environment Variables
Create `backend/.env` with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shebaxpert
DB_PORT=3306
JWT_SECRET=your_secret_key
PORT=5000
OPENAI_API_KEY=your_openai_key (optional)
FACEBOOK_APP_ID=your_facebook_app_id (optional)
FACEBOOK_APP_SECRET=your_facebook_secret (optional)
```

### Database Configuration
MySQL connection settings are in `backend/config/db.js`.

## Troubleshooting

### Common Issues

1. **Port already in use**
   - The startup script automatically kills existing processes
   - Manually check: `netstat -ano | findstr :5000` or `netstat -ano | findstr :8080`

2. **MySQL connection failed**
   - Verify MySQL server is running
   - Check credentials in `.env` file
   - Ensure database exists

3. **Dependencies missing**
   - Run `npm install` in the backend directory
   - Ensure Node.js and Python are installed

### Logs
- Backend logs: Check the backend terminal window
- Frontend logs: Check browser developer console

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- SQL injection protection with parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE file.

---

**Quick Start Command**: `.\start-all.ps1`

For support or questions, please refer to the project documentation or create an issue.
