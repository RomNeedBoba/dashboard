import React, { useState } from "react";
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../api/firebase";
import "../theme/pages/LoginRegister.css";

export default function Login() {
  const [step, setStep] = useState("choose"); // choose, email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [existingProvider, setExistingProvider] = useState(null); // 'google', 'github', or null
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = async (providerName) => {
    setLoading(true);
    setMessage("");
    try {
      const provider = providerName === "google" ? googleProvider : githubProvider;
      await signInWithPopup(auth, provider);
      setMessageType("success");
      setMessage("Logged in successfully!");
    } catch (err) {
      setMessageType("error");
      if (err.code === "auth/popup-closed-by-user") {
        setMessage("Login cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setMessage("An account already exists with this email using a different sign-in method.");
      } else {
        setMessage("Error during social login: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0) {
        // Account exists - check which provider
        if (methods.includes("google.com") && !methods.includes("password")) {
          setExistingProvider("google");
          setMessageType("info");
          setMessage(
            `This email is registered with Google. Please use "Continue with Google" to sign in.`
          );
          setStep("choose");
          setLoading(false);
          return;
        } else if (methods.includes("github.com") && !methods.includes("password")) {
          setExistingProvider("github");
          setMessageType("info");
          setMessage(
            `This email is registered with GitHub. Please use "Continue with GitHub" to sign in.`
          );
          setStep("choose");
          setLoading(false);
          return;
        } else if (methods.includes("password")) {
          // Email/password account exists (or linked with social)
          setExistingProvider(null);
          setIsExistingUser(true);
          setMessageType("info");
          setMessage("Welcome back! Please enter your password to sign in.");
          setStep("password");
          setLoading(false);
          return;
        }
      }
      
      // No account exists - create new one
      setExistingProvider(null);
      setIsExistingUser(false);
      setMessageType("info");
      setMessage("No account found. Create a new account by setting a password.");
      setStep("password");
    } catch (err) {
      setMessageType("error");
      setMessage("Invalid email address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isExistingUser) {
        // Sign in existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setMessageType("error");
          setMessage("Please verify your email before logging in. Check your inbox.");
          await auth.signOut();
        } else {
          setMessageType("success");
          setMessage("Logged in successfully!");
        }
      } else {
        // Check one more time before creating account
        const methods = await fetchSignInMethodsForEmail(auth, email);
        
        if (methods.length > 0) {
          // Account exists with social provider
          if (methods.includes("google.com")) {
            setMessageType("error");
            setMessage("This email is already registered with Google. Please use 'Continue with Google' to sign in.");
            setStep("choose");
            setExistingProvider("google");
          } else if (methods.includes("github.com")) {
            setMessageType("error");
            setMessage("This email is already registered with GitHub. Please use 'Continue with GitHub' to sign in.");
            setStep("choose");
            setExistingProvider("github");
          } else {
            setMessageType("error");
            setMessage("This email is already registered. Please try signing in instead.");
          }
          setLoading(false);
          return;
        }
        
        // Create new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await auth.signOut();
        setMessageType("success");
        setMessage("Account created! Please check your email to verify before logging in.");
        setStep("email");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setMessageType("error");
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setMessage("Incorrect password. Please try again.");
          break;
        case "auth/weak-password":
          setMessage("Password should be at least 6 characters.");
          break;
        case "auth/email-already-in-use":
          setMessage("This email is already registered. If you signed up with Google or GitHub, please use that method to sign in.");
          setStep("choose");
          break;
        case "auth/too-many-requests":
          setMessage("Too many attempts. Please try again later.");
          break;
        default:
          setMessage("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("choose");
    setEmail("");
    setPassword("");
    setMessage("");
    setExistingProvider(null);
    setIsExistingUser(false);
    setLoading(false);
    setShowPassword(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/Raw.png" alt="Logo" className="logo-image" />
          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Sign in or create an account</p>
        </div>

        {message && (
          <div className={`message-alert ${messageType}`}>
            {messageType === "info" && existingProvider && (
              <>
                <div style={{ marginBottom: "8px" }}>You already have an account</div>
                <div>
                  The email <span className="message-email">{email}</span> is registered with{" "}
                  {existingProvider === "google" ? "Google" : "GitHub"}. Please use that method to sign in.
                </div>
              </>
            )}
            {(messageType !== "info" || !existingProvider) && message}
          </div>
        )}

        {/* Step 1: Choose authentication method */}
        {step === "choose" && (
          <div className="button-stack">
            <button
              onClick={() => handleSocialLogin("google")}
              className="auth-button google-button"
              disabled={loading}
            >
              <svg className="button-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin("github")}
              className="auth-button github-button"
              disabled={loading}
            >
              <svg className="button-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>

            <button
              onClick={() => {
                setStep("email");
                setMessage("");
                setExistingProvider(null);
              }}
              className="auth-button email-button"
              disabled={loading}
            >
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Continue with Email
            </button>
          </div>
        )}

        {/* Step 2: Enter email */}
        {step === "email" && (
          <>
            <div className="form-content">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button 
                onClick={handleEmailSubmit}
                className="submit-button"
                disabled={loading || !email}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
              <button 
                onClick={resetForm}
                className="back-button"
                disabled={loading}
              >
                Back
              </button>
            </div>
          </>
        )}

        {/* Step 3: Enter password */}
        {step === "password" && (
          <>
            <div className="form-content">
              <input
                type="email"
                value={email}
                className="input-field"
                disabled
                style={{ opacity: 0.6 }}
              />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isExistingUser ? "Enter your password" : "Create a password (min 6 characters)"}
                  className="input-field"
                  style={{ paddingRight: "45px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={loading}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#718096"
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <button 
                onClick={handlePasswordSubmit}
                className="submit-button"
                disabled={loading || !password}
              >
                {loading ? "Processing..." : isExistingUser ? "Sign In" : "Sign Up"}
              </button>
              <button 
                onClick={() => {
                  setStep("email");
                  setPassword("");
                  setMessage("");
                  setShowPassword(false);
                }}
                className="back-button"
                disabled={loading}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}