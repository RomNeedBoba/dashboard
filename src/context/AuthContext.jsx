import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);  // ✅ more reliable than auth.currentUser
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
  };

  const githubLogin = async () => {
    githubProvider.addScope("read:user");
    const result = await signInWithPopup(auth, githubProvider);
    setUser(result.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleLogin, githubLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
