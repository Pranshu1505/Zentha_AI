import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ReactMarkdown from "react-markdown";

const InterviewPlatform = () => {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Mid-level");
  const [interview, setInterview] = useState(null);
  const [past, setPast] = useState([]);
  const [answerDraft, setAnswerDraft] = useState("");
  const [activeQ, setActiveQ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const fetchPast = async () => {
    const { data } = await api.get("/interviews");
    setPast(data);
  };
  useEffect(() => { fetchPast(); }, []);

  const startInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/interviews/start", { role, experienceLevel: level });
      setInterview(data);
      setActiveQ(0);
      setAnswerDraft("");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answerDraft.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/interviews/${interview._id}/answer`, {
        questionIndex: activeQ,
        answer: answerDraft,
      });
      setInterview(data);
      setAnswerDraft("");
      if (activeQ < data.questions.length - 1) setActiveQ(activeQ + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const finishInterview = async () => {
    setFinishing(true);
    try {
      const { data } = await api.post(`/interviews/${interview._id}/finish`);
      setInterview(data);
      fetchPast();
    } finally {
      setFinishing(false);
    }
  };

  if (!interview) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">🎤 AI Interview Platform</h1>
        <p className="text-muted mb-8">Get 5 tailored questions and instant AI feedback on your answers.</p>

        <form onSubmit={startInterview} className="card p-6 space-y-3 max-w-md">
          <input className="input-field" placeholder="Target role (e.g. Backend Developer)" value={role} onChange={(e) => setRole(e.target.value)} required />
          <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Entry-level</option>
            <option>Mid-level</option>
            <option>Senior</option>
          </select>
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Generating questions..." : "Start Mock Interview"}</button>
        </form>

        {past.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display font-semibold text-white mb-3">Past Sessions</h3>
            <div className="space-y-2">
              {past.map((p) => (
                <div key={p._id} onClick={() => setInterview(p)} className="card p-4 cursor-pointer hover:border-accent/50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{p.role} · {p.experienceLevel}</p>
                    <p className="text-xs text-muted">{p.status} {p.overallScore ? `· Score: ${p.overallScore.toFixed(1)}/10` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const q = interview.questions[activeQ];

  return (
    <div>
      <button onClick={() => setInterview(null)} className="text-sm text-muted hover:text-text mb-4">← Back</button>
      <h1 className="font-display text-2xl font-bold text-white mb-1">{interview.role} Interview</h1>
      <p className="text-muted mb-6">Question {activeQ + 1} of {interview.questions.length}</p>

      <div className="flex gap-2 mb-6">
        {interview.questions.map((qq, i) => (
          <button key={i} onClick={() => { setActiveQ(i); setAnswerDraft(""); }}
            className={`w-8 h-8 rounded-lg text-xs font-medium border ${i === activeQ ? "bg-accent border-accent text-white" : qq.score !== null ? "border-green-500/50 text-green-400" : "border-border text-muted"}`}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <p className="font-medium text-white mb-4">{q.question}</p>
        {q.answer ? (
          <div>
            <p className="text-sm text-muted mb-2">Your answer:</p>
            <p className="text-sm mb-4">{q.answer}</p>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-accent mb-1">AI Feedback {q.score !== null ? `· ${q.score}/10` : ""}</p>
              <p className="text-sm text-muted">{q.feedback}</p>
            </div>
          </div>
        ) : (
          <div>
            <textarea className="input-field" rows={5} placeholder="Type your answer..." value={answerDraft} onChange={(e) => setAnswerDraft(e.target.value)} />
            <button onClick={submitAnswer} className="btn-primary mt-3" disabled={submitting}>{submitting ? "Evaluating..." : "Submit Answer"}</button>
          </div>
        )}
      </div>

      {interview.status !== "completed" && interview.questions.every((qq) => qq.answer) && (
        <button onClick={finishInterview} className="btn-primary mt-6" disabled={finishing}>
          {finishing ? "Generating summary..." : "Finish & Get Overall Feedback"}
        </button>
      )}

      {interview.overallFeedback && (
        <div className="card p-6 mt-6">
          <h3 className="font-display font-semibold text-white mb-3">Overall Performance {interview.overallScore ? `· ${interview.overallScore.toFixed(1)}/10` : ""}</h3>
          <div className="prose-ai text-sm"><ReactMarkdown>{interview.overallFeedback}</ReactMarkdown></div>
        </div>
      )}
    </div>
  );
};

export default InterviewPlatform;
