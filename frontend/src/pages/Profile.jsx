import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateLocalUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await api.put("/auth/profile", payload);
      updateLocalUser(data);
      setMessage("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">👤 Profile</h1>
      <p className="text-muted mb-8">Manage your account details.</p>

      <div className="card p-6 max-w-md space-y-4">
        {user?.avatar && (
          <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full border border-border" />
        )}

        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1 block">Full name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Email</label>
            <input className="input-field opacity-60" value={user?.email || ""} disabled />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-white mb-3">Change password (optional)</p>
            <div className="space-y-3">
              <input className="input-field" type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <input className="input-field" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
              <input className="input-field" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} />
            </div>
          </div>

          <button className="btn-primary w-full" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;