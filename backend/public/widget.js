(function () {
  const script = document.currentScript;
  const publicKey = script.getAttribute("data-key");
  const apiBase = script.getAttribute("data-api") || "http://localhost:5000";
  const sessionId = "sess_" + Math.random().toString(36).slice(2);

  const bubble = document.createElement("div");
  bubble.innerHTML = "💬";
  Object.assign(bubble.style, {
    position: "fixed", bottom: "20px", right: "20px", width: "56px", height: "56px",
    borderRadius: "50%", background: "#7C5CFC", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "24px", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)", zIndex: 999999,
  });

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed", bottom: "88px", right: "20px", width: "320px", height: "440px",
    background: "#fff", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    display: "none", flexDirection: "column", overflow: "hidden", zIndex: 999999,
    fontFamily: "sans-serif",
  });

  const header = document.createElement("div");
  Object.assign(header.style, { background: "#7C5CFC", color: "#fff", padding: "12px 16px", fontWeight: "600" });
  header.textContent = "Chat with us";

  const messages = document.createElement("div");
  Object.assign(messages.style, { flex: "1", padding: "12px", overflowY: "auto", fontSize: "14px" });

  const inputWrap = document.createElement("div");
  Object.assign(inputWrap.style, { display: "flex", borderTop: "1px solid #eee" });

  const input = document.createElement("input");
  input.placeholder = "Type a message...";
  Object.assign(input.style, { flex: "1", border: "none", padding: "10px", outline: "none" });

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  Object.assign(sendBtn.style, { border: "none", background: "#7C5CFC", color: "#fff", padding: "0 16px", cursor: "pointer" });

  inputWrap.append(input, sendBtn);
  panel.append(header, messages, inputWrap);
  document.body.append(bubble, panel);

  function addMessage(role, text) {
    const m = document.createElement("div");
    m.textContent = text;
    Object.assign(m.style, {
      margin: "6px 0", padding: "8px 10px", borderRadius: "8px", maxWidth: "80%",
      background: role === "user" ? "#7C5CFC" : "#f1f1f1",
      color: role === "user" ? "#fff" : "#111",
      marginLeft: role === "user" ? "auto" : "0",
    });
    messages.appendChild(m);
    messages.scrollTop = messages.scrollHeight;
  }

  fetch(`${apiBase}/api/chatbots/public/${publicKey}/config`)
    .then((r) => r.json())
    .then((cfg) => {
      header.textContent = cfg.name || "Chat with us";
      bubble.style.background = cfg.theme || "#7C5CFC";
      sendBtn.style.background = cfg.theme || "#7C5CFC";
      header.style.background = cfg.theme || "#7C5CFC";
      addMessage("assistant", cfg.welcomeMessage || "Hi! How can I help you today?");
    });

  bubble.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  };

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", text);
    input.value = "";
    const res = await fetch(`${apiBase}/api/chatbots/public/${publicKey}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId }),
    });
    const data = await res.json();
    addMessage("assistant", data.reply || "Sorry, something went wrong.");
  }

  sendBtn.onclick = send;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
})();
