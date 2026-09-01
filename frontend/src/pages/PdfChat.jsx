import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

const PdfChat = () => {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [asking, setAsking] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const fetchDocs = async () => {
    const { data } = await api.get("/pdf-chat");
    setDocs(data);
  };
  useEffect(() => { fetchDocs(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const { data } = await api.post("/pdf-chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDocs();
      const { data: fullDoc } = await api.get(`/pdf-chat/${data._id}`);
      setSelected(fullDoc);
      setChat([]);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openDoc = async (id) => {
    const { data } = await api.get(`/pdf-chat/${id}`);
    setSelected(data);
    setChat(data.chatHistory || []);
  };

  const handleDelete = async (id) => {
    await api.delete(`/pdf-chat/${id}`);
    setDocs(docs.filter((d) => d._id !== id));
    if (selected?._id === id) { setSelected(null); setChat([]); }
  };

  const askQuestion = async () => {
    if (!question.trim() || !selected) return;
    const q = question;
    setChat((c) => [...c, { role: "user", content: q }]);
    setQuestion("");
    setAsking(true);
    try {
      const { data } = await api.post(`/pdf-chat/${selected._id}/ask`, { question: q });
      setChat((c) => [...c, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setChat((c) => [...c, { role: "assistant", content: "Sorry, something went wrong answering that." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">📚 AI PDF Chat</h1>
      <p className="text-muted mb-8">Upload a PDF and ask questions — answers are grounded in the document content.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4 lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white mb-3 text-sm">Upload a PDF</h3>
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleUpload} className="text-sm text-muted" disabled={uploading} />
            {uploading && <p className="text-xs text-accent mt-2">Extracting text & generating embeddings...</p>}
          </div>

          <div className="card p-4">
            <h3 className="font-display font-semibold text-white mb-3 text-sm">Your Documents ({docs.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {docs.map((d) => (
                <div key={d._id} onClick={() => openDoc(d._id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${selected?._id === d._id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}>
                  <div className="truncate pr-2">
                    <p className="text-sm font-medium truncate">{d.fileName}</p>
                    <p className="text-xs text-muted">{d.messageCount} messages</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(d._id); }} className="text-xs text-red-400 hover:text-red-300 shrink-0">Delete</button>
                </div>
              ))}
              {docs.length === 0 && <p className="text-sm text-muted">No PDFs uploaded yet.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-4 flex flex-col h-[560px]">
              <h3 className="font-display font-semibold text-white mb-3 text-sm truncate">{selected.fileName}</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chat.length === 0 && (
                  <p className="text-sm text-muted">Ask anything about this document — e.g. "Summarize the key points" or "What does section 2 say about pricing?"</p>
                )}
                {chat.map((m, i) => (
                  <div key={i} className={`text-sm p-3 rounded-lg max-w-[85%] ${m.role === "user" ? "bg-accent/20 ml-auto" : "bg-surface2"}`}>
                    {m.content}
                  </div>
                ))}
                {asking && <div className="text-sm p-3 rounded-lg max-w-[85%] bg-surface2 text-muted">Thinking...</div>}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <input
                  className="input-field"
                  placeholder="Ask a question about this PDF..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  disabled={asking}
                />
                <button className="btn-primary" onClick={askQuestion} disabled={asking}>Ask</button>
              </div>
            </div>
          ) : (
            <div className="card p-10 h-[560px] flex items-center justify-center">
              <p className="text-muted text-sm">Select or upload a PDF to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfChat;
