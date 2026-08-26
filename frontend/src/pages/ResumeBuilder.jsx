import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ReactMarkdown from "react-markdown";

const emptyForm = {
  fullName: "", email: "", phone: "", targetRole: "",
  summary: "", skills: "", experienceCompany: "", experienceRole: "",
  experienceDuration: "", experienceDescription: "",
};

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const fetchResumes = async () => {
    const { data } = await api.get("/resumes");
    setResumes(data);
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.targetRole ? `${form.targetRole} Resume` : "Untitled Resume",
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        targetRole: form.targetRole,
        summary: form.summary,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience: form.experienceCompany
          ? [{ company: form.experienceCompany, role: form.experienceRole, duration: form.experienceDuration, description: form.experienceDescription }]
          : [],
      };
      const { data } = await api.post("/resumes", payload);
      setResumes([data, ...resumes]);
      setSelected(data);
      setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async (id) => {
    setEnhancing(true);
    try {
      const { data } = await api.post(`/resumes/${id}/ai-enhance`);
      setSelected(data.resume);
      setResumes(resumes.map((r) => (r._id === id ? data.resume : r)));
    } finally {
      setEnhancing(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/resumes/${id}`);
    setResumes(resumes.filter((r) => r._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">📄 AI Resume Builder</h1>
      <p className="text-muted mb-8">Fill your details, then let AI enhance the wording and suggest skills.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleCreate} className="card p-6 space-y-3 h-fit">
          <h3 className="font-display font-semibold text-white mb-2">New Resume</h3>
          <input className="input-field" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <input className="input-field" placeholder="Target role (e.g. Frontend Developer)" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} required />
          <textarea className="input-field" rows={3} placeholder="Brief summary (optional — AI can write this)" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <input className="input-field" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" placeholder="Most recent company" value={form.experienceCompany} onChange={(e) => setForm({ ...form, experienceCompany: e.target.value })} />
            <input className="input-field" placeholder="Role title" value={form.experienceRole} onChange={(e) => setForm({ ...form, experienceRole: e.target.value })} />
          </div>
          <input className="input-field" placeholder="Duration (e.g. Jan 2023 - Present)" value={form.experienceDuration} onChange={(e) => setForm({ ...form, experienceDuration: e.target.value })} />
          <textarea className="input-field" rows={2} placeholder="What did you do there?" value={form.experienceDescription} onChange={(e) => setForm({ ...form, experienceDescription: e.target.value })} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Saving..." : "Save Resume"}</button>
        </form>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white mb-3">Your Resumes ({resumes.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {resumes.map((r) => (
                <div key={r._id} onClick={() => setSelected(r)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${selected?._id === r._id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted">{r.targetRole}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
              {resumes.length === 0 && <p className="text-sm text-muted">No resumes yet — create one on the left.</p>}
            </div>
          </div>

          {selected && (
            <div className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-semibold text-white">{selected.title}</h3>
                <button onClick={() => handleEnhance(selected._id)} className="btn-primary text-sm" disabled={enhancing}>
                  {enhancing ? "Enhancing..." : "✨ AI Enhance"}
                </button>
              </div>
              {selected.aiSuggestions ? (
                <div className="prose-ai text-sm"><ReactMarkdown>{selected.aiSuggestions}</ReactMarkdown></div>
              ) : (
                <p className="text-sm text-muted">Click "AI Enhance" to get a professional summary, improved bullet points, and skill suggestions.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
