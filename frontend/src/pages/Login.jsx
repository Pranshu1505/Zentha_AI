import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-6">
      <div className="card w-full max-w-sm p-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-6">Log in to your Zentha AI dashboard</p>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <GoogleAuthButton />
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
        </form>
        <p className="text-sm text-muted mt-5 text-center">
          No account? <Link to="/register" className="text-accent">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
