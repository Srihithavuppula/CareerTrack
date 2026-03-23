import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Shield, LogOut, Menu, X, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isActive = (path) =>
    location.pathname === path ||
    (path === "/courses" && location.pathname === "/");

  // Prepare mobile nav items to avoid duplicates, and include Admin for admin role
  const getMobileNavItems = () => {
    const items = [
      { to: "/courses", label: "Courses" }
    ];
    if (isAuthenticated) {
      items.push(
        { to: "/mocktests", label: "Mock Tests" },
        { to: "/dashboard", label: "Dashboard" }
      );
      if (user?.role === "admin") {
        items.push({ to: "/admin/courses", label: "Admin" });
      }
    } else {
      items.push(
        { to: "/login", label: "Login" }
      );
    }
    return items;
  };

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: "1px solid #e2e8f0",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              boxShadow: "0 2px 10px rgba(37,99,235,0.35)",
            }}
          >
            <BookOpen size={17} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-slate-900 tracking-tight">
              Career<span className="gradient-text">Track</span>
            </p>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Learn smarter. Build consistently.
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/courses"
            className={`nav-link ${isActive("/courses") ? "nav-link-active" : ""}`}
          >
            Courses
          </Link>
          {isAuthenticated && (
            <Link
              to="/mocktests"
              className={`nav-link ${isActive("/mocktests") ? "nav-link-active" : ""}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList size={14} />
                Mock Tests
              </span>
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "nav-link-active" : ""}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <LayoutDashboard size={14} />
                Dashboard
              </span>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin/courses"
              className={`nav-link ${isActive("/admin/courses") ? "nav-link-active" : ""}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Shield size={14} />
                Admin
              </span>
            </Link>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <div
                className="hidden sm:flex items-center gap-2.5 rounded-xl px-3 py-2"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-[10px] capitalize text-slate-400">{user?.role}</p>
                </div>
              </div>

              <button onClick={() => setShowLogoutModal(true)} className="btn-secondary">
  <LogOut size={14} />
  <span className="hidden sm:inline">Logout</span>
</button>

{showLogoutModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
  >
    <div className="card mx-4 w-full max-w-sm p-8">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
        style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
      >
        <LogOut size={20} className="text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Logout?</h2>
      <p className="text-sm text-slate-500">
        Are you sure you want to logout from CareerTrack?
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
          style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}
            </>
          )}

          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 space-y-1 border-t border-slate-100">
          {getMobileNavItems().map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full mt-2"
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;