import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-6">
      <div className="card w-full max-w-sm p-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Set a new password</h1>
        <p className="text-muted text-sm mb-6">Choose a strong password for your account.</p>

        {success ? (
          <p className="text-sm text-green-400">Password reset! Redirecting to login...</p>
        ) : (
          <>
            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="input-field" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <input className="input-field" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
              <button className="btn-primary w-full" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</button>
            </form>
          </>
        )}

        <p className="text-sm text-muted mt-5 text-center">
          <Link to="/login" className="text-accent">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;