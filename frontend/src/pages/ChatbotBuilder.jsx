import { useEffect, useState } from "react";
import api from "../api/axios.js";

const ChatbotBuilder = () => {
  const [bots, setBots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", websiteUrl: "", businessInfo: "", welcomeMessage: "Hi! How can I help you today?" });
  const [loading, setLoading] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const [testChat, setTestChat] = useState([]);
  const [sending, setSending] = useState(false);
  const sessionId = "test_" + Math.random().toString(36).slice(2);

  const fetchBots = async () => {
    const { data } = await api.get("/chatbots");
    setBots(data);
  };
  useEffect(() => { fetchBots(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/chatbots", form);
      setBots([data, ...bots]);
      setSelected(data);
      setForm({ name: "", websiteUrl: "", businessInfo: "", welcomeMessage: "Hi! How can I help you today?" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/chatbots/${id}`);
    setBots(bots.filter((b) => b._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const sendTestMessage = async () => {
    if (!testMsg.trim()) return;
    const msg = testMsg;
    setTestChat([...testChat, { role: "user", content: msg }]);
    setTestMsg("");
    setSending(true);
    try {
      const { data } = await api.post(`/chatbots/public/${selected.publicKey}/message`, { message: msg, sessionId });
      setTestChat((c) => [...c, { role: "assistant", content: data.reply }]);
    } finally {
      setSending(false);
    }
  };

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
  const embedCode = selected ? `<script src="${apiBase}/widget.js" data-key="${selected.publicKey}" data-api="${apiBase}"></script>` : "";

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">💬 AI Chatbot for Websites</h1>
      <p className="text-muted mb-8">Train a chatbot on your business info, then embed it anywhere with one script tag.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleCreate} className="card p-6 space-y-3 h-fit">
          <h3 className="font-display font-semibold text-white mb-2">New Chatbot</h3>
          <input className="input-field" placeholder="Bot name (e.g. Acme Support)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" placeholder="Website URL (optional)" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
          <input className="input-field" placeholder="Welcome message" value={form.welcomeMessage} onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })} />
          <textarea className="input-field" rows={6} placeholder="Business info / FAQ / product details the bot should know..." value={form.businessInfo} onChange={(e) => setForm({ ...form, businessInfo: e.target.value })} required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Create Chatbot"}</button>
        </form>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white mb-3">Your Chatbots ({bots.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {bots.map((b) => (
                <div key={b._id} onClick={() => { setSelected(b); setTestChat([]); }} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${selected?._id === b._id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <p className="text-sm font-medium">{b.name}</p>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(b._id); }} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
              {bots.length === 0 && <p className="text-sm text-muted">No chatbots yet.</p>}
            </div>
          </div>

          {selected && (
            <>
              <div className="card p-4">
                <h3 className="font-display font-semibold text-white mb-2 text-sm">Embed on your website</h3>
                <pre className="text-xs bg-base border border-border rounded-lg p-3 overflow-x-auto text-accent">{embedCode}</pre>
              </div>

              <div className="card p-4">
                <h3 className="font-display font-semibold text-white mb-3 text-sm">Test "{selected.name}"</h3>
                <div className="h-48 overflow-y-auto space-y-2 mb-3 border border-border rounded-lg p-3">
                  {testChat.map((m, i) => (
                    <div key={i} className={`text-sm p-2 rounded-lg max-w-[85%] ${m.role === "user" ? "bg-accent/20 ml-auto" : "bg-surface2"}`}>{m.content}</div>
                  ))}
                  {testChat.length === 0 && <p className="text-xs text-muted">Send a message to test your bot's responses.</p>}
                </div>
                <div className="flex gap-2">
                  <input className="input-field" placeholder="Ask something..." value={testMsg} onChange={(e) => setTestMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendTestMessage()} />
                  <button className="btn-primary" onClick={sendTestMessage} disabled={sending}>{sending ? "..." : "Send"}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotBuilder;
