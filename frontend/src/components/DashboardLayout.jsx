import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "◧", end: true },
  { to: "/dashboard/resume-builder", label: "Resume Builder", icon: "📄" },
  { to: "/dashboard/interview", label: "Interview Platform", icon: "🎤" },
  { to: "/dashboard/chatbot", label: "Website Chatbot", icon: "💬" },
  { to: "/dashboard/code-reviewer", label: "Code Reviewer", icon: "🧠" },
  { to: "/dashboard/pdf-chat", label: "PDF Chat", icon: "📚" },
  { to: "/dashboard/profile", label: "Profile", icon: "👤" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-base text-text font-body">
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        <span className="font-display text-lg font-bold text-white">Zentha <span className="text-accent">AI</span></span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-64 shrink-0 border-r border-border bg-surface flex flex-col fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <span className="font-display text-xl font-bold text-white">Zentha <span className="text-accent">AI</span></span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
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

      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;