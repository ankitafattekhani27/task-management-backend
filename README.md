
 

A full-featured backend API for managing tasks and users. Built with **Node.js**, **Express**, and **MongoDB**, this application supports user registration, authentication with JWT, and comprehensive task management including filtering, assignment, and dashboard insights.

---
 

- User registration and login (JWT authentication)
- Password hashing using bcrypt
- Create, update, delete, and filter tasks
- Assign tasks to users
- Dashboard with task summaries (created, assigned, overdue)
- Protected routes with middleware authentication

---

 
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs
- jsonwebtoken
- dotenv

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/task-manager-api.git
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

---

## ▶️ Running the Server

Start the development server:

```bash
npm start
```

The server will be running on: `http://localhost:5000`

---

## 📂 Project Structure

```
.
├── server.js             # Entry point
├── config/
│   └── db.js             # MongoDB connection
├── middleware/
│   └── authMiddleware.js # JWT authentication middleware
├── models/
│   ├── User.js           # User model
│   └── Task.js           # Task model
├── routes/
│   ├── authRoutes.js     # Routes for login/register
│   └── taskRoutes.js     # Task-related routes
├── controllers/
│   └── authController.js # Auth logic
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🔐 API Endpoints

### 🔑 Authentication

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login and receive token |

### 📋 Tasks

| Method | Endpoint                      | Description                                 |
|--------|-------------------------------|---------------------------------------------|
| POST   | `/api/tasks`                  | Create a new task (auth required)           |
| GET    | `/api/tasks`                  | Get all tasks with filters (auth required)  |
| GET    | `/api/tasks/assigned-to-me`   | Tasks assigned to current user              |
| GET    | `/api/tasks/dashboard`        | Summary dashboard for current user          |
| PUT    | `/api/tasks/:id`              | Update task details (auth required)         |
| DELETE | `/api/tasks/:id`              | Delete task (auth required)                 |

---

## 📊 Dashboard API Example

```http
GET /api/tasks/dashboard
```

Returns:
```json
{
  "createdTasks": [...],
  "assignedTasks": [...],
  "overdueTasks": [...]
}
```

---

## 🛡️ Security Notes

- Passwords are hashed with `bcryptjs`.
- JWT tokens are used to secure private routes.
- Sensitive data is stored in `.env` and should **not** be committed to version control.

---

 
