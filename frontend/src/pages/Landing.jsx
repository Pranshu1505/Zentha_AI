import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const modules = [
  { name: "Resume Builder", icon: "📄", desc: "AI-tailored summaries, bullet points & skill gaps for any target role." },
  { name: "Interview Platform", icon: "🎤", desc: "Practice with AI-generated questions and get scored feedback per answer." },
  { name: "Website Chatbot", icon: "💬", desc: "Spin up a support chatbot trained on your business, embed it anywhere." },
  { name: "Code Reviewer", icon: "🧠", desc: "Instant senior-level review: bugs, security, performance, readability." },
  { name: "PDF Chat", icon: "📚", desc: "Upload any PDF and ask questions — answers grounded in the document." },
];

const Landing = () => {
  return (
    <div className="bg-base text-text font-body overflow-hidden relative">
      {/* ambient glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute top-96 -left-40 w-[400px] h-[400px] rounded-full bg-accent2/10 blur-[120px]" />

      <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-3 sm:py-5">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-display text-base sm:text-xl font-bold text-white">Zentha <span className="text-accent">AI</span></span>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link to="/login" className="btn-secondary text-xs sm:text-sm !px-2.5 !py-1.5 sm:!px-4 sm:!py-2.5">Log in</Link>
          <Link to="/register" className="btn-primary text-xs sm:text-sm !px-2.5 !py-1.5 sm:!px-4 sm:!py-2.5">Get started</Link>
        </div>
      </header>

      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-3 sm:pt-12 pb-5 sm:pb-10">
        <span className="inline-block px-2.5 py-0.5 rounded-full border border-accent/40 text-accent text-[11px] sm:text-xs font-medium mb-2 sm:mb-4">
          5 AI tools · One dashboard
        </span>
        <h1 className="font-display text-xl sm:text-4xl md:text-6xl font-bold leading-tight text-white">
          Everything you build, write, review, and hire with —
          <span className="text-accent"> powered by one AI core.</span>
        </h1>
        <p className="text-muted text-xs sm:text-lg mt-2 sm:mt-4 max-w-2xl mx-auto">
          Zentha AI bundles a resume builder, mock interviewer, embeddable support chatbot,
          code reviewer, and PDF Q&A assistant into a single account.
        </p>
        <div className="mt-3 sm:mt-6 flex justify-center gap-2 sm:gap-4">
          <Link to="/register" className="btn-primary text-xs sm:text-sm !px-3 !py-2 sm:!px-5 sm:!py-2.5">Create free account</Link>
          <Link to="/login" className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-5 sm:!py-2.5">I already have one</Link>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-6 sm:pb-14">
        <div className="grid md:grid-cols-3 gap-2 sm:gap-4">
          {modules.map((m, i) => (
            <div key={m.name} className={`card p-3 sm:p-6 ${i === 0 ? "md:col-span-2" : ""}`}>
              <div className="text-base sm:text-2xl mb-1 sm:mb-3">{m.icon}</div>
              <h3 className="font-display font-semibold text-white mb-0.5 sm:mb-1 text-xs sm:text-base">{m.name}</h3>
              <p className="text-[11px] sm:text-sm text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-display text-sm sm:text-lg font-bold text-white">Zentha <span className="text-accent">AI</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] sm:text-sm text-muted">
            <Link to="/register" className="hover:text-text transition-colors">Get started</Link>
            <Link to="/login" className="hover:text-text transition-colors">Log in</Link>
            <a href="#" className="hover:text-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-text transition-colors">Terms</a>
          </div>

          <p className="text-[11px] text-muted">© {new Date().getFullYear()} Zentha AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;