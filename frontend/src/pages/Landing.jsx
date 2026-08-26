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

      <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-4 sm:py-6">
        <div className="flex items-center gap-2">
          <Logo size={26} />
          <span className="font-display text-lg sm:text-xl font-bold text-white">Zentha <span className="text-accent">AI</span></span>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link to="/login" className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-4">Log in</Link>
          <Link to="/register" className="btn-primary text-xs sm:text-sm !px-3 !py-2 sm:!px-4">Get started</Link>
        </div>
      </header>

      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-6 sm:pt-14 pb-8 sm:pb-12">
        <span className="inline-block px-3 py-1 rounded-full border border-accent/40 text-accent text-xs font-medium mb-3 sm:mb-5">
          5 AI tools · One dashboard
        </span>
        <h1 className="font-display text-2xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
          Everything you build, write, review, and hire with —
          <span className="text-accent"> powered by one AI core.</span>
        </h1>
        <p className="text-muted text-sm sm:text-lg mt-3 sm:mt-5 max-w-2xl mx-auto">
          Zentha AI bundles a resume builder, mock interviewer, embeddable support chatbot,
          code reviewer, and PDF Q&A assistant into a single account.
        </p>
        <div className="mt-5 sm:mt-7 flex justify-center gap-3 sm:gap-4">
          <Link to="/register" className="btn-primary text-sm">Create free account</Link>
          <Link to="/login" className="btn-secondary text-sm">I already have one</Link>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-10 sm:pb-16">
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
          {modules.map((m, i) => (
            <div key={m.name} className={`card p-4 sm:p-6 ${i === 0 ? "md:col-span-2" : ""}`}>
              <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{m.icon}</div>
              <h3 className="font-display font-semibold text-white mb-1 text-sm sm:text-base">{m.name}</h3>
              <p className="text-xs sm:text-sm text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-display text-base sm:text-lg font-bold text-white">Zentha <span className="text-accent">AI</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs sm:text-sm text-muted">
            <Link to="/register" className="hover:text-text transition-colors">Get started</Link>
            <Link to="/login" className="hover:text-text transition-colors">Log in</Link>
            <a href="#" className="hover:text-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-text transition-colors">Terms</a>
          </div>

          <p className="text-xs text-muted">© {new Date().getFullYear()} Zentha AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;