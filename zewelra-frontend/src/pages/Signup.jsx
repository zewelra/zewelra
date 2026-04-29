import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const { name, email, password } = form;

    if (!name.trim() || !email.trim() || !password.trim()) {
      return "All fields are required";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);
      setError("");

      const { name, email, password } = form;

      await signup(email, password, name);

      setSuccess("Account created successfully 🎉");

      // 🔥 small delay for UX
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      console.log(err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/weak-password":
          setError("Weak password");
          break;
        case "auth/network-request-failed":
          setError("Network error, try again");
          break;
        default:
          setError("Signup failed, try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F2EF] px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        <h2 className="text-3xl font-serif text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Join ZEWELRA luxury experience
        </p>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-600 text-sm p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e7b6a1] outline-none disabled:bg-gray-100"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e7b6a1] outline-none disabled:bg-gray-100"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e7b6a1] outline-none disabled:bg-gray-100"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-full 
            hover:scale-105 hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up →"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e7b6a1] font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;