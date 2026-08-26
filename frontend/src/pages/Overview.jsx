import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const cards = [
  { to: "/dashboard/resume-builder", icon: "📄", title: "Resume Builder", desc: "Build & AI-enhance your resume" },
  { to: "/dashboard/interview", icon: "🎤", title: "Interview Platform", desc: "Practice mock interviews with AI" },
  { to: "/dashboard/chatbot", icon: "💬", title: "Website Chatbot", desc: "Create an embeddable support bot" },
  { to: "/dashboard/code-reviewer", icon: "🧠", title: "Code Reviewer", desc: "Get instant AI code reviews" },
  { to: "/dashboard/pdf-chat", icon: "📚", title: "PDF Chat", desc: "Chat with your documents" },
];

const Overview = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="text-muted mt-1 mb-8">Pick a tool to get started.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link to={c.to} key={c.to} className="card p-6 hover:border-accent/50 transition-colors">
            <div className="text-2xl mb-3">{c.icon}</div>
            <h3 className="font-display font-semibold text-white">{c.title}</h3>
            <p className="text-sm text-muted mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Overview;
