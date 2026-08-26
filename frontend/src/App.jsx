import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Overview from "./pages/Overview.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import InterviewPlatform from "./pages/InterviewPlatform.jsx";
import ChatbotBuilder from "./pages/ChatbotBuilder.jsx";
import CodeReviewer from "./pages/CodeReviewer.jsx";
import PdfChat from "./pages/PdfChat.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="interview" element={<InterviewPlatform />} />
            <Route path="chatbot" element={<ChatbotBuilder />} />
            <Route path="code-reviewer" element={<CodeReviewer />} />
            <Route path="pdf-chat" element={<PdfChat />} />
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
