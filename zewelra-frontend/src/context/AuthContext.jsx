import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

// Firebase Auth
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// Firestore
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER DATA ================= */
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        setRole(data.role || "user");
        setUserData(data);

        // 🔥 cache
        localStorage.setItem("role", JSON.stringify(data.role));
        localStorage.setItem("userData", JSON.stringify(data));

      } else {
        setRole("user");
      }

    } catch (err) {
      console.log(err);
      setRole("user");
    }
  };

  /* ================= AUTH LISTENER ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if (currentUser) {
        setUser(currentUser);

        // try cache first
        const cachedUser = localStorage.getItem("userData");
        if (cachedUser) {
          setUserData(JSON.parse(cachedUser));
        }

        await fetchUserData(currentUser.uid);

      } else {
        setUser(null);
        setRole(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= SIGNUP ================= */
  const signup = async (email, password, name, phone = "") => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(res.user, {
          displayName: name
        });
      }

      const userObj = {
        uid: res.user.uid,
        name,
        email,
        phone,
        role: "user",
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", res.user.uid), userObj);

      setUser(res.user);
      setUserData(userObj);
      setRole("user");

      return res.user;

    } catch (err) {
      throw err;
    }
  };

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (err) {
      throw err;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setUserData(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("role");
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateUserProfile = async (data) => {
    try {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);

      await setDoc(docRef, data, { merge: true });

      const updated = { ...userData, ...data };
      setUserData(updated);

      localStorage.setItem("userData", JSON.stringify(updated));

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= VALUE ================= */
  const value = {
    user,
    currentUser: user,
    role,
    isAdmin: role === "admin",

    userData, // 🔥 important for checkout

    login,
    signup,
    logout,
    updateUserProfile
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EF]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};