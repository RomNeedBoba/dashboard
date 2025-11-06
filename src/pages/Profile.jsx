import React, { useState, useEffect } from "react";
import { auth } from "../api/firebase";
import { 
  updateProfile, 
  updateEmail, 
  deleteUser,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import "../theme/pages/Profile.css";

export default function Profile({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [enhanceContrast, setEnhanceContrast] = useState(
    localStorage.getItem("enhanceContrast") === "true"
  );

  // Form states - removed role and language
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || ""); // Keep for display, but not editable

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update display name only
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      showMessage("success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      showMessage("error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  const handleContrastToggle = () => {
    const newValue = !enhanceContrast;
    setEnhanceContrast(newValue);
    localStorage.setItem("enhanceContrast", newValue);
    document.documentElement.setAttribute("data-contrast", newValue ? "high" : "normal");
  };

  const getProviderForReauth = () => {
    const providerId = user?.providerData[0]?.providerId;
    if (providerId === "google.com") {
      return new GoogleAuthProvider();
    } else if (providerId === "github.com") {
      return new GithubAuthProvider();
    }
    return null;
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showMessage("error", "Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // Reauthenticate before deleting
      const provider = getProviderForReauth();
      if (provider) {
        await reauthenticateWithPopup(user, provider);
      }

      // Delete the user
      await deleteUser(user);
      
      // Clear local storage
      localStorage.clear();
      
      // Redirect to login
      if (onNavigate) {
        onNavigate("/login");
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        showMessage("error", "Please log out and log back in before deleting your account.");
      } else {
        showMessage("error", "Failed to delete account. Please try again.");
      }
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getUserInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const getProviderName = () => {
    const providerId = user?.providerData[0]?.providerId;
    if (providerId === "google.com") return "Google";
    if (providerId === "github.com") return "GitHub";
    if (providerId === "password") return "Email";
    return "Unknown";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button 
          className="back-button" 
          onClick={() => onNavigate ? onNavigate("/dashboard") : window.history.back()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1>Settings</h1>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button
            className={`tab ${activeTab === "community" ? "active" : ""}`}
            onClick={() => setActiveTab("community")}
          >
            Community
          </button>
          <button
            className={`tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {activeTab === "account" && (
          <div className="tab-content">
            <div className="profile-section">
              <div className="avatar-section">
                <div className="large-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <button className="edit-avatar-btn" disabled>
                  Edit
                </button>
              </div>

              <div className="profile-fields">
                <div className="field-group">
                  <label>Name</label>
                  <div className="field-with-action">
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="field-value">{displayName || "Not set"}</div>
                    )}
                    {!isEditing && (
                      <button 
                        className="link-button" 
                        onClick={() => setIsEditing(true)}
                      >
                        Change name
                      </button>
                    )}
                  </div>
                </div>

                <div className="field-divider" />

                <div className="field-group">
                  <label>Email</label>
                  <div className="field-with-action">
                    <div className="field-value">{email}</div>
                    <div className="field-hint">Managed by {getProviderName()}</div>
                  </div>
                </div>

                <div className="field-divider" />

                <div className="field-group">
                  <label>Theme</label>
                  <select 
                    value={theme} 
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="theme-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={enhanceContrast}
                      onChange={handleContrastToggle}
                    />
                    <span>Enhance contrast</span>
                  </label>
                  <div className="field-hint">
                    When enabled, contrast between text and controls and their backgrounds will be increased.
                  </div>
                </div>

                {isEditing && (
                  <div className="action-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user?.displayName || "");
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <div className="danger-content">
                <div>
                  <strong>Delete Account</strong>
                  <p>Permanently delete your account and all associated data</p>
                </div>
                <button 
                  className="btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="tab-content">
            <div className="empty-state">
              <p>Community settings coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="tab-content">
            <div className="empty-state">
              <p>Notification settings coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="tab-content">
            <div className="profile-section">
              <div className="field-group">
                <label>Authentication Method</label>
                <div className="field-value">
                  Signed in with {getProviderName()}
                </div>
              </div>
              <div className="field-divider" />
              <div className="field-group">
                <label>Account Security</label>
                <div className="field-hint">
                  Your account is secured by {getProviderName()} authentication.
                  Two-factor authentication is managed through your {getProviderName()} account.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <>
          <div 
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="modal">
            <div className="modal-header">
              <h2>Delete Account</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <p className="warning-text">
               This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              <p>Please type <strong>DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="confirm-input"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}