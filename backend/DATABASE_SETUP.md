# ShebaXpert Backend Setup Guide

## Database Setup Instructions

### 1. Prerequisites
- MySQL Server installed and running
- Node.js (v14 or higher)
- npm or yarn

### 2. MySQL Database Setup

#### Install MySQL (if not already installed)
```bash
# Windows: Download from https://dev.mysql.com/downloads/mysql/
# Or use Chocolatey:
choco install mysql

# Start MySQL service
net start mysql
```

#### Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE shebaxpert;

-- Create user (optional, for security)
CREATE USER 'shebaxpert_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON shebaxpert.* TO 'shebaxpert_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Backend Configuration

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=shebaxpert
   JWT_SECRET=your_jwt_secret_change_this_in_production
   PORT=5000
   ```

#### Initialize Database
```bash
# Initialize database with 3NF schema
npm run db:init

# Create test user (optional)
npm run db:test-user

# Or do both at once
npm run db:setup
```

#### Verify Setup
```bash
# Verify database structure
npm run db:verify

# Start server
npm run dev
```

### 4. Database Schema (3NF Normalized)

The database follows Third Normal Form (3NF) principles:

#### Primary Tables:
- **user_roles**: Normalized user role types
- **user_status**: Normalized user status types  
- **users**: Main user information (references roles and status)
- **user_sessions**: Authentication sessions
- **password_reset_tokens**: Password reset functionality
- **email_verification_tokens**: Email verification
- **login_attempts**: Security audit log

#### Key Normalization Features:
- Separate role and status tables eliminate redundancy
- Foreign key relationships maintain data integrity
- Indexed fields for optimal query performance
- Proper data types and constraints

### 5. API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

#### Health Check
- `GET /api/health` - Database and server status

### 6. Frontend Integration

#### Update API Base URL
In your frontend files, ensure API calls point to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:8000` (Local file server)
- File protocol (`file://`)

### 7. Testing the Setup

#### Test Database Connection
```bash
# Check health endpoint
curl http://localhost:5000/api/health
```

#### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "testpass123",
    "phone": "+1234567890"
  }'
```

#### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "testpass123"
  }'
```

### 8. Troubleshooting

#### Common Issues:

1. **Database Connection Error**
   - Check MySQL is running: `net start mysql`
   - Verify credentials in `.env` file
   - Test connection: `mysql -u root -p`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process: `netstat -ano | findstr :5000`

3. **CORS Errors**
   - Check frontend URL in CORS configuration
   - Ensure requests include proper headers

4. **Authentication Errors**
   - Verify JWT_SECRET is set in `.env`
   - Check token format in Authorization header

### 9. Database Management Commands

```bash
# Reset database (WARNING: This will delete all data)
npm run db:reset

# Just initialize schema
npm run db:init

# Create test user
npm run db:test-user

# Verify database structure
npm run db:verify
```

### 10. Production Considerations

- Change JWT_SECRET to a secure random string
- Use environment-specific database credentials
- Enable HTTPS in production
- Set up proper logging
- Configure rate limiting based on requirements
- Set up database backups
- Use connection pooling for high traffic

### 11. Next Steps

1. Test the registration and login forms
2. Implement email verification (requires email service setup)
3. Add password reset functionality
4. Implement user profile management
5. Add service booking functionality
