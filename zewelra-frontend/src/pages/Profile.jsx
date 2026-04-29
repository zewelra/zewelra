import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";

// 🔥 FIREBASE
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: ""
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FROM FIREBASE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      try {
        // 🔥 GET USER DOC
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setForm({
            name: currentUser.displayName || "",
            email: currentUser.email || "",
            phone: data.phone || "",
            city: data.city || "",
            address: data.address || ""
          });
        } else {
          // first time user
          setForm({
            name: currentUser.displayName || "",
            email: currentUser.email || "",
            phone: "",
            city: "",
            address: ""
          });
        }

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    loadProfile();
  }, [currentUser]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.name) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 UPDATE AUTH NAME
      if (currentUser.displayName !== form.name) {
        await updateProfile(currentUser, {
          displayName: form.name
        });
      }

      // 🔥 SAVE TO FIRESTORE
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          phone: form.phone,
          city: form.city,
          address: form.address,
          updatedAt: new Date()
        },
        { merge: true }
      );

      setSaved(true);

    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }

    setLoading(false);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  /* ================= AVATAR ================= */
  const avatarLetter = form.name
    ? form.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      <h1 className="text-4xl font-serif mb-10">
        My <span className="text-[#e7b6a1]">Profile</span>
      </h1>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md 
      p-8 md:p-10 rounded-2xl shadow">

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-10">

          <div className="w-20 h-20 rounded-full bg-[#e7b6a1]/20 flex items-center justify-center text-2xl font-semibold text-[#e7b6a1]">
            {avatarLetter}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {form.name || "Your Name"}
            </h2>
            <p className="text-gray-500 text-sm">
              {form.email}
            </p>
          </div>

        </div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-6">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input"
          />

          <input
            name="email"
            value={form.email}
            disabled
            className="input bg-gray-100 cursor-not-allowed"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="input"
          />

        </div>

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows="4"
          placeholder="Full Address"
          className="input mt-6"
        />

        {/* STATUS */}
        {saved && (
          <p className="text-green-600 text-sm mt-4">
            Profile updated successfully ✅
          </p>
        )}

        {/* BUTTON */}
        <div className="mt-8 text-right">

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-full 
            bg-gradient-to-r from-black to-gray-800 
            text-white hover:scale-105 transition 
            disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes →"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;