# Task Management Application

A full-stack Task Management System built using the MERN stack.  
The application allows users to create tasks, assign them to multiple users, track task status, and collaborate in real time using Socket.IO.

---

## Features

### Authentication & Authorization
- User registration and login using JWT
- Protected routes on frontend and backend
- Access control:
  - Only task creators can update, delete, or assign tasks
  - Assigned users can view task details

### Task Management
- Create tasks with title and description
- Update task details
- Delete tasks (creator only)
- Change task status:
  - Pending
  - In Progress
  - Completed

### Task Assignment
- Assign tasks to multiple users
- Prevent duplicate assignment per task
- Same user can be assigned to multiple tasks
- Assignment logic handled independently per task

### Task Views
- Dashboard displaying:
  - Tasks created by the user
  - Tasks assigned to the user
- Detailed task view showing:
  - Title
  - Description
  - Status
  - Assigned users

### Real-Time Updates
- Real-time task creation
- Real-time task updates
- Real-time task deletion
- Real-time task assignment
- Implemented using Socket.IO (no page refresh required)

### UI / UX
- Clean and responsive user interface
- Reusable header component
- Consistent styling across all pages
- Professional dashboard layout

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO


---

## Key Highlights

- JWT-based authentication
- Many-to-many relationship between users and tasks
- Task-level isolation for assignments
- Real-time synchronization using Socket.IO
- Clean and maintainable codebase

---

## Future Enhancements
- Unassign users from tasks
- Task priority and due dates
- Activity logs
- Notifications
- Role-based permissions

---

## Author

Jeffery  
Engineering Student | Full-Stack Developer

---

## License
This project is for educational and learning purposes.



