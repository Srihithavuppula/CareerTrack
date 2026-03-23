import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) return setError("Name is required.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      const { token, user } = response.data;
      login(user, token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength =
    formData.password.length === 0 ? 0
    : formData.password.length < 4 ? 1
    : formData.password.length < 7 ? 2
    : formData.password.length < 10 ? 3 : 4;

  const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const strengthLabels = ["", "Too short", "Weak", "Good", "Strong"];

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f4ff" }}>

      {/* ── Left Panel — Illustration ─────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#e8f0fe 0%,#dbeafe 50%,#eff6ff 100%)" }}
      >
        {/* Blobs */}
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(59,130,246,0.06)' }} />

        {/* Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              boxShadow: "0 2px 10px rgba(37,99,235,0.35)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-slate-900 tracking-tight">
              Career<span style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Track</span>
            </p>
            <p className="text-xs text-slate-400">Learn smarter. Build consistently.</p>
          </div>
        </div>
        {/* Animated SVG Scene */}
        <div className="relative w-full max-w-sm">
          <style>{`
            @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
            @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
            @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
            @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
            @keyframes draw{to{stroke-dashoffset:0}}
            .cf1{animation:floatUp 3s ease-in-out infinite}
            .cf2{animation:floatUp 3s ease-in-out infinite 1s}
            .cf3{animation:floatUp 3s ease-in-out infinite 2s}
            .pbob{animation:bob 4s ease-in-out infinite}
            .bpulse{animation:pulse 2s ease-in-out infinite}
            .si1{animation:fadeUp .8s .3s ease forwards;opacity:0;transform:translateY(10px)}
            .si2{animation:fadeUp .8s .6s ease forwards;opacity:0;transform:translateY(10px)}
            .si3{animation:fadeUp .8s .9s ease forwards;opacity:0;transform:translateY(10px)}
            .cdraw{stroke-dasharray:30;stroke-dashoffset:30;animation:draw .6s ease forwards 1.5s}
          `}</style>
          <svg viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',overflow:'visible'}}>
            <defs>
              <linearGradient id="lmon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e40af"/>
                <stop offset="100%" stopColor="#2563eb"/>
              </linearGradient>
              <linearGradient id="lscr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1d4ed8"/>
                <stop offset="100%" stopColor="#2563eb"/>
              </linearGradient>
              <filter id="lsh">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1e40af" floodOpacity="0.2"/>
              </filter>
              <filter id="lcsh">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1e40af" floodOpacity="0.12"/>
              </filter>
            </defs>
            {/* SVG content omitted for brevity */}
            {/* ... */}
          </svg>
        </div>

        {/* Caption */}
        <div className="text-center mt-3 relative">
          <h2 className="text-xl font-bold text-slate-800">Online Education</h2>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            Learn at your own pace with structured roadmaps and expert resources.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 mt-5">
          {[{v:'12+',l:'Courses'},{v:'300+',l:'Questions'},{v:'100%',l:'Free'}].map((s,i) => (
            <div key={s.l} className="text-center" style={{animation:`fadeUp .8s ${0.3+i*0.3}s ease forwards`,opacity:0,transform:'translateY(10px)'}}>
              <p className="text-xl font-bold text-blue-600">{s.v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        <style>{`@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}`}</style>
      </div>

      {/* ── Right Panel — Form ────────────────────────── */}
      <div
        className="flex flex-1 items-center justify-center px-6 py-10"
        style={{ background: "#ffffff" }}
      >
        <div className="w-full max-w-md">

          {/* Mobile logo (now matches the left side logo) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                boxShadow: "0 2px 10px rgba(37,99,235,0.35)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-slate-900 tracking-tight">
                Career<span style={{
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Track</span>
              </p>
              <p className="text-xs text-slate-400">Learn smarter. Build consistently.</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-blue-600 font-semibold text-sm mb-1">GET STARTED</p>
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">
              Join thousands of learners building their careers.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="text-slate-400 shrink-0" />
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Enter your full name"
                  className="input-field" required />
              </div>
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter your email"
                  className="input-field" required />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field" required />
                <button type="button" onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 transition shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((l) => (
                      <div key={l} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: strength >= l ? strengthColors[strength] : "#f1f5f9" }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="field-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password" className="input-field" required />
                <button type="button" onClick={() => setShowConfirm((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 transition shrink-0">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all mt-2"
              style={{
                background: loading
                  ? "#93c5fd"
                  : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                boxShadow: loading ? "none" : "0 4px 15px rgba(37,99,235,0.35)",
              }}
            >
              {loading ? "Creating account..." : "Start Lesson →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;