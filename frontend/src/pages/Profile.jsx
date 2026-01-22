import React, { useEffect, useState } from "react";
import API from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setMessage("");

    API.get("/users/me")
      .then((res) => {
        setUser(res.data);
        setProfileName(res.data?.name || "");
        setProfileEmail(res.data?.email || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    API.put("/users/me", { name: profileName, email: profileEmail })
      .then((res) => {
        setUser(res.data);
        setMessage("✅ Profile updated");
        setSaving(false);
      })
      .catch((err) => {
        const msg = err?.response?.data || "Failed to update profile";
        setError(String(msg));
        setSaving(false);
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setPasswordSaving(true);

    API.put("/users/me/password", { currentPassword, newPassword })
      .then(() => {
        setMessage("✅ Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setPasswordSaving(false);
      })
      .catch((err) => {
        const msg = err?.response?.data || "Failed to update password";
        setError(String(msg));
        setPasswordSaving(false);
      });
  };

  if (loading) return <div className="container"><p>Loading profile...</p></div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1rem" }}>👤 Profile</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {user && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          <div className="cart-container">
            <h2 style={{ marginBottom: "1rem" }}>Account Details</h2>
            <div style={{ marginBottom: "0.75rem" }}>
              <strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}
            </div>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={saving} className="admin-edit-btn">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          <div className="cart-container">
            <h2 style={{ marginBottom: "1rem" }}>Change Password</h2>
            <form onSubmit={updatePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={passwordSaving} className="admin-edit-btn">
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {user.isAdmin && (
            <div className="cart-container">
              <h2 style={{ marginBottom: "1rem" }}>Admin Options</h2>
              <div style={{ color: "#666" }}>
                Manage products from the Admin dashboard.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
