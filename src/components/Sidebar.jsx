import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { useAuth } from "../context/AuthContext";
import "../theme/components/sidebar.css";

export default function Sidebar({ currentPage }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      path: "/dashboard"
    },
    {
      id: "projects",
      label: "Projects",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      path: "/projects"
    },
    {
      id: "teams",
      label: "Teams",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      path: "/teams"
    }
  ];

  const getUserInitials = () => {
    // Try display name first
    if (user?.displayName) {
      const names = user.displayName.trim().split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.displayName.slice(0, 2).toUpperCase();
    }
    
    // Fallback to email
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    
    // Last resort
    return "U";
  };

  const getUserDisplayName = () => {
    // Priority: displayName > email username > "User"
    if (user?.displayName && user.displayName.trim()) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserEmail = () => {
    return user?.email || "No email";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <img src="/Raw.png" alt="Logo" className="sidebar-logo" />
          <img src="/Text.png" alt="Logo" className="sidebar-logo" />
        </div>
        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading...
        </div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Raw.png" alt="Logo" className="sidebar-logo" />
        <img src="/Text.png" alt="Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <button
            className="profile-trigger"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {user?.photoURL && !imageError ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{getUserInitials()}</span>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {getUserDisplayName()}
              </div>
              <div className="profile-email">
                {getUserEmail()}
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`chevron ${showProfileMenu ? "rotated" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="profile-menu-overlay"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="profile-menu">
                <div className="menu-section">
                  <button
                    className={`menu-item theme-option ${theme === "light" ? "active" : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    <span>Light</span>
                    {theme === "light" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <button
                    className={`menu-item theme-option ${theme === "dark" ? "active" : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <span>Dark</span>
                    {theme === "dark" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <button
                    className={`menu-item theme-option ${theme === "system" ? "active" : ""}`}
                    onClick={() => handleThemeChange("system")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <span>System</span>
                    {theme === "system" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="menu-divider" />

                <button
                  className="menu-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <div className="menu-divider" />

                <button className="menu-item logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}