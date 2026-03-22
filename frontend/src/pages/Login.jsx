import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* --- Animated SVG helper --- */
const AnimatedSVG = () => {
  // Refs for moving elements (optional for further expansion)
  const [animateReady, setAnimateReady] = useState(false);

  // Animate SVG on mount (for progressive fade/slide in effects)
  useEffect(() => {
    setTimeout(() => setAnimateReady(true), 120);
  }, []);

  return (
    <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" className={`w-full transition-all duration-1000 ${animateReady ? 'opacity-100' : 'opacity-0 translate-y-5'}`}>
      {/* Background blob with floating animation */}
      <ellipse
        cx="280" cy="280" rx="180" ry="140"
        fill="#2563eb" opacity="0.10"
        style={{
          animation: "blobFade 5s ease-in-out infinite alternate"
        }}
      />

      {/* Laptop base with soft fade/slide-in */}
      <g style={{
        opacity: animateReady ? 1 : 0,
        transform: animateReady ? "translateX(0)" : "translateX(40px)",
        transition: "all 1.2s cubic-bezier(.5,-0.5,.25,1.5) 0.3s"
      }}>
        <rect x="120" y="220" width="260" height="160" rx="12" fill="#1e3a8a" />
        <rect x="130" y="228" width="240" height="140" rx="8" fill="#1d4ed8" />
        <rect x="130" y="228" width="240" height="140" rx="8" fill="url(#screen)" />
        <defs>
          <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect x="145" y="240" width="210" height="12" rx="4" fill="white" opacity="0.3" />
        <rect x="145" y="260" width="160" height="8" rx="4" fill="white" opacity="0.2" />
        <rect x="145" y="276" width="180" height="8" rx="4" fill="white" opacity="0.2" />
        <rect x="145" y="295" width="60" height="22" rx="6" fill="#60a5fa" />
        <text x="175" y="310" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">START</text>
        <rect x="100" y="378" width="300" height="14" rx="7" fill="#94a3b8" />
        <rect x="185" y="374" width="130" height="6" rx="3" fill="#cbd5e1" />
      </g>

      {/* Standing person group w/ pop-in bounce */}
      <g style={{
        opacity: animateReady ? 1 : 0,
        transform: animateReady ? "scale(1)" : "scale(0.8)",
        transformOrigin: "328px 185px",
        transition: "all 900ms 0.6s cubic-bezier(.4,1.8,.4,1)"
      }}>
        <rect x="310" y="200" width="36" height="80" rx="10" fill="#2563eb" />
        <circle cx="328" cy="185" r="22" fill="#fbbf24" />
        <path d="M306 178 Q328 155 350 178" fill="#1e293b" />
        {/* Graduation cap tilt animation */}
        <rect x="312" y="163" width="32" height="6" rx="2" fill="#1e293b"
          style={{
            transform: animateReady ? "rotate(-5deg)" : "rotate(-40deg)",
            transformOrigin: "328px 166px",
            transition: "all 1200ms .9s cubic-bezier(.21,1,.2,1)"
          }}
        />
        <rect x="318" y="157" width="20" height="8" rx="2" fill="#1e293b"
          style={{
            transform: animateReady ? "rotate(-4deg)" : "rotate(-50deg)",
            transformOrigin: "328px 161px",
            transition: "all 1250ms 1.2s cubic-bezier(.21,1,.2,1)"
          }}
        />
        <line x1="344" y1="166" x2="352" y2="178" stroke="#1e293b" strokeWidth="2" />
        <circle cx="352" cy="180" r="3" fill="#2563eb" />
        {/* Arms - slight up-down floating animation */}
        <rect x="288" y="210" width="24" height="10" rx="5" fill="#2563eb"
          style={{
            animation: animateReady ? "armFloat 2.1s ease-in-out infinite alternate" : "none"
          }} />
        <rect x="344" y="210" width="24" height="10" rx="5" fill="#2563eb"
          style={{
            animation: animateReady ? "armFloat 2.3s ease-in-out infinite alternate-reverse" : "none"
          }} />
        {/* Legs */}
        <rect x="312" y="276" width="14" height="50" rx="7" fill="#1e3a8a" />
        <rect x="330" y="276" width="14" height="50" rx="7" fill="#1e3a8a" />
        {/* Shoes */}
        <rect x="306" y="322" width="22" height="10" rx="5" fill="#1e293b" />
        <rect x="324" y="322" width="22" height="10" rx="5" fill="#1e293b" />
        {/* Hand pointing - bounce pulse */}
        <circle cx="288" cy="215" r="6" fill="#fbbf24"
          style={{
            animation: animateReady ? "handBounce 2.6s 1.5s cubic-bezier(.5,.7,.9,1) infinite alternate" : "none"
          }}
        />
      </g>

      {/* Sitting person group */}
      <g style={{
        opacity: animateReady ? 1 : 0,
        transform: animateReady ? "translateY(0)" : "translateY(44px)",
        transition: "all 1s .7s cubic-bezier(.3,1,.1,1.1)"
      }}>
        <rect x="148" y="195" width="30" height="65" rx="8" fill="#3b82f6" />
        <circle cx="163" cy="182" r="18" fill="#fbbf24" />
        <path d="M145 175 Q163 158 181 175" fill="#92400e" />
        <rect x="134" y="210" width="18" height="8" rx="4" fill="#3b82f6"
          style={{
            animation: animateReady ? "typingHandA 1.7s infinite alternate" : "none"
          }} />
        <rect x="178" y="210" width="18" height="8" rx="4" fill="#3b82f6"
          style={{
            animation: animateReady ? "typingHandB 1.65s infinite alternate-reverse" : "none"
          }} />
        <circle cx="134" cy="214" r="5" fill="#fbbf24" />
        <circle cx="196" cy="214" r="5" fill="#fbbf24" />
        <rect x="148" y="255" width="12" height="30" rx="6" fill="#1e40af" />
        <rect x="164" y="255" width="12" height="30" rx="6" fill="#1e40af" />
      </g>

      {/* Floating chart bars, books, play button, and stars with fade/float */}
      <g style={{
        opacity: animateReady ? 1 : 0,
        transform: animateReady ? "scale(1) translateY(0)" : "scale(0.95) translateY(22px)",
        transition: "all 1.1s .9s cubic-bezier(.6,1.15,.4,1.12)"
      }}>
        {/* Chart bars jittering */}
        <rect x="60" y="140" width="12" height="40" rx="3" fill="#2563eb" opacity="0.7"
          style={{
            animation: animateReady ? "chartJitter 2.8s infinite alternate " : "none"
          }} />
        <rect x="76" y="120" width="12" height="60" rx="3" fill="#3b82f6" opacity="0.7"
          style={{
            animation: animateReady ? "chartJitter2 2.6s 0.2s infinite alternate" : "none"
          }} />
        <rect x="92" y="130" width="12" height="50" rx="3" fill="#60a5fa" opacity="0.7"
          style={{
            animation: animateReady ? "chartJitter3 2.5s 0.4s infinite alternate" : "none"
          }} />
        <rect x="58" y="180" width="48" height="3" rx="1" fill="#94a3b8" opacity="0.5" />

        {/* Books stack - pop in */}
        <rect x="380" y="290" width="70" height="14" rx="4" fill="#2563eb"
          style={{ transform: animateReady ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.6s 1s cubic-bezier(.1,1,.5,1)" }} />
        <rect x="385" y="278" width="60" height="14" rx="4" fill="#3b82f6"
          style={{ transform: animateReady ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.5s 1.25s cubic-bezier(.1,1,.5,1)" }} />
        <rect x="390" y="266" width="50" height="14" rx="4" fill="#60a5fa"
          style={{ transform: animateReady ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.4s 1.4s cubic-bezier(.1,1,.5,1)" }} />

        {/* Play button scale/fade */}
        <circle cx="420" cy="160" r="28" fill="#2563eb" opacity="0.15"
          style={{
            transform: animateReady ? "scale(1)" : "scale(0.7)",
            transition: "transform 0.4s 1.2s cubic-bezier(.3,1.6,.7,1.1)"
          }} />
        <circle cx="420" cy="160" r="20" fill="#2563eb" opacity="0.2"
          style={{
            transform: animateReady ? "scale(1)" : "scale(0.7)",
            transition: "transform 0.44s 1.25s cubic-bezier(.3,1.6,.7,1.1)"
          }} />
        <polygon points="413,152 413,168 429,160" fill="#2563eb" opacity="0.8"
          style={{
            transform: animateReady ? "translateX(0)" : "translateX(22px)",
            opacity: animateReady ? 1 : 0,
            transition: "all 0.46s 1.36s cubic-bezier(.4,1.1,.7,1.2)"
          }} />

        {/* Stars twinkle */}
        <text x="72" y="115" fontSize="16" fill="#fbbf24"
          style={{
            animation: animateReady ? "starTwinkle 2.5s infinite alternate" : "none"
          }}>★</text>
        <text x="400" y="100" fontSize="12" fill="#fbbf24"
          style={{
            animation: animateReady ? "starTwinkle2 2.2s infinite alternate" : "none"
          }}>★</text>
        <text x="450" y="230" fontSize="10" fill="#93c5fd"
          style={{
            animation: animateReady ? "starTwinkle3 2.1s infinite alternate" : "none"
          }}>★</text>
      </g>
      {/* Keyframes via <style> for SVG */}
      <style>
        {`
          @keyframes blobFade {
            0% { opacity: 0.10; rx: 180; ry: 140; }
            60% { opacity: 0.16; rx: 188; ry: 145;}
            100% { opacity: 0.09; rx: 186; ry: 135;}
          }
          @keyframes armFloat {
            0% { transform: translateY(0);}
            100% { transform: translateY(8px);}
          }
          @keyframes handBounce {
            0% { transform: scale(1);}
            30% { transform: scale(1.16);}
            60% { transform: scale(0.91);}
            100% { transform: scale(1.06);}
          }
          @keyframes typingHandA {
            0% { transform: translateY(0);}
            100% { transform: translateY(7px);}
          }
          @keyframes typingHandB {
            0% { transform: translateY(0);}
            100% { transform: translateY(-7px);}
          }
          @keyframes chartJitter {
            0% { transform: scaleY(1);}
            100% { transform: scaleY(1.15);}
          }
          @keyframes chartJitter2 {
            0% { transform: scaleY(1);}
            100% { transform: scaleY(1.12);}
          }
          @keyframes chartJitter3 {
            0% { transform: scaleY(1);}
            100% { transform: scaleY(1.09);}
          }
          @keyframes starTwinkle {
            0% { opacity: 1; }
            66% { opacity: 0.78; }
            100%{ opacity: 1;}
          }
          @keyframes starTwinkle2 {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100%{ opacity: 1;}
          }
          @keyframes starTwinkle3 {
            0% { opacity: 1; }
            77% { opacity: 0.35; }
            100%{ opacity: 1;}
          }
        `}
      </style>
    </svg>
  );
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f4ff" }}>
      {/* ── Left Panel — Illustration ─────────────────── */}
      <div
  className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-10 relative overflow-hidden"
  style={{ background: "linear-gradient(160deg,#e8f0fe 0%,#dbeafe 50%,#eff6ff 100%)" }}
>
  {/* Blobs */}
  <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(37,99,235,0.08)' }} />
  <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(59,130,246,0.06)' }} />

  {/* Logo */}
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

      {/* Monitor */}
      <rect x="196" y="248" width="28" height="40" rx="5" fill="#94a3b8"/>
      <rect x="170" y="284" width="80" height="10" rx="5" fill="#cbd5e1"/>
      <rect x="50" y="40" width="320" height="218" rx="14" fill="url(#lmon)" filter="url(#lsh)"/>
      <rect x="62" y="52" width="296" height="194" rx="9" fill="url(#lscr)"/>
      <rect x="62" y="52" width="296" height="28" rx="9" fill="#1e3a8a" opacity="0.6"/>
      <circle cx="82" cy="66" r="5" fill="#ef4444" opacity="0.85"/>
      <circle cx="96" cy="66" r="5" fill="#fbbf24" opacity="0.85"/>
      <circle cx="110" cy="66" r="5" fill="#22c55e" opacity="0.85"/>
      <rect x="290" y="58" width="52" height="16" rx="8" fill="#3b82f6" opacity="0.5"/>

      {/* Cards */}
      <g className="cf1">
        <rect x="72" y="92" width="82" height="64" rx="8" fill="white" opacity="0.13" stroke="white" strokeWidth="0.5" strokeOpacity="0.25"/>
        <rect x="80" y="100" width="28" height="28" rx="7" fill="#60a5fa" opacity="0.9"/>
        <polyline points="88,114 93,119 100,110" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="cdraw"/>
        <rect x="80" y="135" width="44" height="5" rx="2.5" fill="white" opacity="0.5"/>
        <rect x="80" y="144" width="30" height="4" rx="2" fill="white" opacity="0.3"/>
      </g>
      <g className="cf2">
        <rect x="169" y="92" width="82" height="64" rx="8" fill="white" opacity="0.13" stroke="white" strokeWidth="0.5" strokeOpacity="0.25"/>
        <rect x="177" y="100" width="28" height="28" rx="7" fill="#34d399" opacity="0.9"/>
        <text x="191" y="119" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">42</text>
        <rect x="177" y="135" width="52" height="5" rx="2.5" fill="white" opacity="0.5"/>
        <rect x="177" y="144" width="38" height="4" rx="2" fill="white" opacity="0.3"/>
      </g>
      <g className="cf3">
        <rect x="266" y="92" width="82" height="64" rx="8" fill="white" opacity="0.13" stroke="white" strokeWidth="0.5" strokeOpacity="0.25"/>
        <rect x="274" y="100" width="28" height="28" rx="7" fill="#f59e0b" opacity="0.9"/>
        <text x="288" y="119" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">98%</text>
        <rect x="274" y="135" width="40" height="5" rx="2.5" fill="white" opacity="0.5"/>
        <rect x="274" y="144" width="28" height="4" rx="2" fill="white" opacity="0.3"/>
      </g>

      {/* Progress bars */}
      <text x="72" y="172" fontSize="9" fill="white" opacity="0.6">React.js Roadmap</text>
      <rect x="72" y="176" width="276" height="6" rx="3" fill="white" opacity="0.1"/>
      <rect x="72" y="176" height="6" rx="3" fill="#60a5fa" opacity="0.9">
        <animate attributeName="width" from="0" to="195" dur="1.8s" fill="freeze" begin="0.5s"/>
      </rect>
      <text x="72" y="196" fontSize="9" fill="white" opacity="0.6">DSA Course</text>
      <rect x="72" y="200" width="276" height="6" rx="3" fill="white" opacity="0.1"/>
      <rect x="72" y="200" height="6" rx="3" fill="#34d399" opacity="0.9">
        <animate attributeName="width" from="0" to="240" dur="2s" fill="freeze" begin="0.8s"/>
      </rect>
      <text x="72" y="220" fontSize="9" fill="white" opacity="0.6">DBMS Mock Test</text>
      <rect x="72" y="224" width="276" height="6" rx="3" fill="white" opacity="0.1"/>
      <rect x="72" y="224" height="6" rx="3" fill="#f59e0b" opacity="0.9">
        <animate attributeName="width" from="0" to="140" dur="1.6s" fill="freeze" begin="1.1s"/>
      </rect>

      {/* Person */}
      <g className="pbob">
        <rect x="166" y="272" width="74" height="8" rx="4" fill="#94a3b8"/>
        <rect x="172" y="279" width="7" height="22" rx="3" fill="#cbd5e1"/>
        <rect x="227" y="279" width="7" height="22" rx="3" fill="#cbd5e1"/>
        <path d="M178 278 Q174 295 168 305" fill="none" stroke="#1e3a8a" strokeWidth="15" strokeLinecap="round"/>
        <path d="M228 278 Q232 295 238 305" fill="none" stroke="#1e3a8a" strokeWidth="15" strokeLinecap="round"/>
        <ellipse cx="163" cy="308" rx="14" ry="7" fill="#1e293b"/>
        <ellipse cx="243" cy="308" rx="14" ry="7" fill="#1e293b"/>
        <rect x="175" y="220" width="56" height="56" rx="14" fill="#2563eb"/>
        <rect x="188" y="228" width="18" height="3" rx="1.5" fill="white" opacity="0.3"/>
        <rect x="188" y="235" width="13" height="3" rx="1.5" fill="white" opacity="0.2"/>
        <path d="M175 232 Q152 248 142 262" fill="none" stroke="#2563eb" strokeWidth="13" strokeLinecap="round"/>
        <path d="M231 232 Q254 248 264 262" fill="none" stroke="#2563eb" strokeWidth="13" strokeLinecap="round"/>
        <ellipse cx="138" cy="265" rx="9" ry="7" fill="#fcd34d"/>
        <ellipse cx="268" cy="265" rx="9" ry="7" fill="#fcd34d"/>
        <rect x="191" y="210" width="24" height="14" rx="7" fill="#fcd34d"/>
        <ellipse cx="203" cy="196" rx="26" ry="28" fill="#fcd34d"/>
        <path d="M178 184 Q190 162 203 164 Q216 162 228 184 Q222 171 203 168 Q184 171 178 184" fill="#1e293b"/>
        <rect x="177" y="176" width="6" height="14" rx="3" fill="#1e293b"/>
        <ellipse cx="195" cy="197" rx="3" ry="3.5" fill="#1e293b"/>
        <ellipse cx="211" cy="197" rx="3" ry="3.5" fill="#1e293b"/>
        <circle cx="196" cy="195" r="1" fill="white"/>
        <circle cx="212" cy="195" r="1" fill="white"/>
        <path d="M197 207 Q203 212 209 207" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M178 192 Q178 164 203 164 Q228 164 228 192" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
        <rect x="172" y="188" width="10" height="14" rx="5" fill="#1e3a8a"/>
        <rect x="224" y="188" width="10" height="14" rx="5" fill="#1e3a8a"/>
      </g>

      {/* Badges */}
      <g className="bpulse" style={{transformOrigin:'355px 30px'}}>
        <rect x="305" y="8" width="100" height="44" rx="10" fill="white" filter="url(#lcsh)"/>
        <rect x="313" y="16" width="18" height="18" rx="5" fill="#dbeafe"/>
        <polyline points="319,25 323,29 329,21" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" className="cdraw"/>
        <rect x="337" y="18" width="52" height="5" rx="2.5" fill="#e2e8f0"/>
        <rect x="337" y="27" width="38" height="4" rx="2" fill="#f1f5f9"/>
        <rect x="337" y="35" width="44" height="4" rx="2" fill="#f1f5f9"/>
      </g>
      <g className="cf1" style={{transformOrigin:'28px 160px'}}>
        <rect x="0" y="130" width="56" height="60" rx="10" fill="white" filter="url(#lcsh)"/>
        <text x="28" y="155" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="700">🔥 7</text>
        <text x="28" y="167" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="600">day</text>
        <text x="28" y="178" textAnchor="middle" fontSize="8" fill="#64748b">streak</text>
      </g>

      <ellipse cx="210" cy="320" rx="190" ry="14" fill="#bfdbfe" opacity="0.35"/>
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
        className="flex flex-1 items-center justify-center px-6 py-12"
        style={{
          // Glass white effect:
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.08)",
          border: "1px solid rgba(220,224,255,0.25)"
        }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            >
              CT
            </div>
            <span className="text-lg font-bold text-slate-800">CareerTrack</span>
          </div>
          <div className="mb-8">
            <p className="text-blue-600 font-semibold text-sm mb-1">WELCOME BACK</p>
            <h1 className="text-3xl font-bold text-slate-900">Login to your account</h1>
            <p className="mt-2 text-sm text-slate-500">
              Continue your learning journey today.
            </p>
          </div>
          {error && (
            <div className="mb-6 rounded-xl px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter your email"
                  className="input-field" required
                />
              </div>
            </div>
            <div>
              <label className="field-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" className="input-field" required
                />
                <button
                  type="button" onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 transition shrink-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all"
              style={{
                background: loading
                  ? "#93c5fd"
                  : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                boxShadow: loading ? "none" : "0 4px 15px rgba(37,99,235,0.35)",
              }}
            >
              {loading ? "Logging in..." : "Start Lesson →"}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              Create one free
            </Link>
          </p>
          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['30-60 Day Roadmaps', 'Mock Tests', 'Daily Progress', 'Free Access'].map((f) => (
              <span
                key={f}
                className="rounded-full px-3 py-1 text-xs font-medium text-blue-700"
                style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;