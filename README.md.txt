# Task Management API

A full-stack task management application with user authentication, task CRUD operations, and a responsive web interface.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (pending, in-progress, completed)
- **Role-Based Access**: User and admin roles with appropriate permissions
- **Rate Limiting**: Protection against brute-force attacks
- **Responsive Design**: Mobile-friendly interface
- **Data Persistence**: MongoDB database with indexed queries

## Tech Stack

### Backend
- **Node.js** with Express.js 4.x
- **MongoDB** for data storage
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-rate-limit** for rate limiting
- **dotenv** for environment configuration

### Frontend
- **Vanilla JavaScript** (ES6+)
- **HTML5** with semantic markup
- **CSS3** with Flexbox and CSS Grid
- **Fetch API** for HTTP communication

## Project Structure

```
web4sig/
├── src/
│   ├── server.js                 # Express app setup
│   ├── controllers/
│   │   ├── authController.js     # Auth endpoints logic
│   │   └── taskController.js     # Task endpoints logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification and authorization
│   │   └── rateLimiter.js        # Request rate limiting
│   ├── models/
│   │   └── Model.js              # MongoDB operations (CRUD)
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── taskRoutes.js         # Task endpoints
│   │   └── userRoutes.js         # User endpoints
│   └── utils/
│       ├── database.js           # MongoDB connection and indexing
│       ├── security.js           # Password hashing and JWT
│       └── validation.js         # Input validation
├── public/
│   ├── index.html                # Main HTML page
│   ├── css/
│   │   └── style.css             # Styling and responsive design
│   └── js/
│       ├── api.js                # API client class
│       └── app.js                # Frontend logic
├── package.json                  # Dependencies
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose setup
└── README.md                     # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd web4sig
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=task_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
```

5. **Start the application**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Docker Setup

Run with Docker Compose:

```bash
docker-compose up --build
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017 |
| `DB_NAME` | Database name | task_management |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRY` | JWT expiration time | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 10 |

### Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes
- **General endpoints**: 100 requests per 15 minutes

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/me` | Get current user info |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create new task |
| GET | `/tasks` | Get all user tasks |
| GET | `/tasks/:id` | Get task by ID |
| PATCH | `/tasks/:id` | Update task status |
| DELETE | `/tasks/:id` | Delete task |

### Request/Response Examples

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Create Task
```bash
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app"
}

Response:
{
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "pending",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-06T10:00:00Z",
    "updatedAt": "2026-02-06T10:00:00Z"
  }
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String ("user" | "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  title: String (max 200),
  description: String (max 5000),
  status: String ("pending" | "in-progress" | "completed"),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `users.email`: Unique index
- `tasks.userId`: Index for query optimization
- `tasks.createdAt`: Index for sorting
- `tasks.userId, tasks.createdAt`: Composite index

## Security Features

- **Password Security**: Bcrypt hashing with 10 salt rounds
- **JWT Authentication**: Token-based auth with 7-day expiry
- **Rate Limiting**: Prevents brute-force attacks
- **Input Validation**: Server-side validation of all inputs
- **XSS Protection**: HTML escaping in frontend
- **CORS**: Can be configured for production

## Development

### Running in Development Mode
```bash
npm run dev
```

### Available Scripts
```bash
npm start      # Production server
npm run dev    # Development with nodemon
```

## Frontend Usage

1. **Register**: Create new account with email and password
2. **Login**: Sign in to access task management
3. **Create Task**: Add new task with title and description
4. **Filter Tasks**: View tasks by status
5. **Update Task**: Change task status
6. **Delete Task**: Remove task from list

## Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: 400 Bad Request
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Not Found**: 404 Not Found
- **Server Errors**: 500 Internal Server Error

## Performance Optimizations

- MongoDB indexes for faster queries
- JWT tokens for stateless authentication
- CSS optimization with CSS variables
- Minified frontend assets (can be further optimized)
- Responsive images and lazy loading support

## Future Enhancements

- [ ] Task categories/tags
- [ ] Task priority levels
- [ ] Due dates and reminders
- [ ] Task sharing between users
- [ ] Email notifications
- [ ] Dark mode UI
- [ ] Export tasks to PDF/CSV
- [ ] Bulk operations
- [ ] Search functionality
- [ ] Advanced filtering

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Last Updated**: February 6, 2026
**Version**: 1.0.0
