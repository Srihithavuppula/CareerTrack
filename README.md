# CareerTrack

CareerTrack is a full-stack MERN learning platform that helps students explore courses, generate personalized learning roadmaps, track daily progress, and take mock tests in a clean premium UI.

## Live Demo

- **Frontend:** https://career-track-alpha.vercel.app
- **Backend:** https://careertrack-l1wo.onrender.com

## GitHub Repository

- **Repo:** https://github.com/Srihithavuppula/CareerTrack

---

## Features

### User Features
- Register and login with JWT authentication
- Browse available courses
- Generate personalized **30 / 45 / 60-day roadmaps**
- Track daily roadmap completion
- Reset or delete roadmaps
- View progress on dashboard
- Take mock tests with:
  - MCQ questions
  - True/False questions
- View attempted mock tests and scores on dashboard

### Admin Features
- Role-based admin access
- Create new courses
- Edit existing courses
- Delete courses
- Manage course resources and topic structure

### UI/UX Features
- Premium white + blue gradient design
- Glassmorphism cards and soft shadows
- Responsive layout
- Animated auth pages
- Weekly accordion roadmap overview
- Clean dashboard with roadmap progress and mock test history

---

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- lucide-react

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

### Deployment
- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Backend uptime monitoring using **UptimeRobot**

---

## Project Structure

```bash
CareerTrack/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── roadmapController.js
│   │   └── mockTestController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Roadmap.js
│   │   ├── MockTest.js
│   │   └── MockTestAttempt.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── roadmapRoutes.js
│   │   └── mockTestRoutes.js
│   │
│   ├── seedCourses.js
│   ├── seedMockTests.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoadmapFlowchart.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminCourses.jsx
│   │   │   ├── MockTests.jsx
│   │   │   └── MockTestPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── vercel.json
│
└── README.md
