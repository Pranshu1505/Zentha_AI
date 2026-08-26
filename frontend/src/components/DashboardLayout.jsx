import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "◧", end: true },
  { to: "/dashboard/resume-builder", label: "Resume Builder", icon: "📄" },
  { to: "/dashboard/interview", label: "Interview Platform", icon: "🎤" },
  { to: "/dashboard/chatbot", label: "Website Chatbot", icon: "💬" },
  { to: "/dashboard/code-reviewer", label: "Code Reviewer", icon: "🧠" },
  { to: "/dashboard/pdf-chat", label: "PDF Chat", icon: "📚" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-base text-text font-body">
      <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-xl font-bold text-white">Zentha <span className="text-accent">AI</span></span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? "bg-accent/15 text-white border border-accent/40" : "text-muted hover:bg-surface2 hover:text-text"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-muted mb-2 truncate">{user?.email}</p>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full btn-secondary text-sm"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
