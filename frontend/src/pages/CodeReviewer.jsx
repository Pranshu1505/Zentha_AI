import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ReactMarkdown from "react-markdown";

const languages = ["javascript", "python", "java", "typescript", "c++", "go", "php", "html/css"];

const CodeReviewer = () => {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const { data } = await api.get("/code-reviews");
    setReviews(data);
  };
  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/code-reviews", { title, language, code });
      setReviews([data, ...reviews]);
      setSelected(data);
      setTitle("");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/code-reviews/${id}`);
    setReviews(reviews.filter((r) => r._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">🧠 AI Code Reviewer</h1>
      <p className="text-muted mb-8">Paste your code and get a senior-level review: bugs, security, performance, readability.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="card p-6 space-y-3 h-fit">
          <h3 className="font-display font-semibold text-white mb-2">Submit Code</h3>
          <input className="input-field" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <textarea
            className="input-field font-mono text-sm"
            rows={14}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Reviewing..." : "Run AI Review"}</button>
        </form>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white mb-3">Past Reviews ({reviews.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reviews.map((r) => (
                <div key={r._id} onClick={() => setSelected(r)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${selected?._id === r._id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted">{r.language} {r.bugScore !== null ? `· Score: ${r.bugScore}/10` : ""}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet — submit code on the left.</p>}
            </div>
          </div>

          {selected && (
            <div className="card p-5 max-h-[520px] overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-semibold text-white">{selected.title}</h3>
                {selected.bugScore !== null && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/40">Score: {selected.bugScore}/10</span>
                )}
              </div>
              <div className="prose-ai text-sm"><ReactMarkdown>{selected.review}</ReactMarkdown></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewer;
