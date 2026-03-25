import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import AdminCourses from "./pages/AdminCourses";
import MockTests from "./pages/MockTests";
import MockTestPage from "./pages/MockTestPage";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      {!hideNavbar && <Navbar />}

      {hideNavbar ? (
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      ) : (
        <main className="page-container flex-1">
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap/:roadmapId"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mocktests"
              element={
                <ProtectedRoute>
                  <MockTests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mocktests/:testId"
              element={
                <ProtectedRoute>
                  <MockTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;