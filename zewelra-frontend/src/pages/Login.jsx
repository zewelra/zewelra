import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, role } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      return "All fields are required";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email";
    }

    return null;
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);

      const { email, password } = form;

      await login(email, password);

      // 🔥 role already AuthContext me aa raha hai
      // wait until role is available
      const checkRole = setInterval(() => {
        const storedRole = JSON.parse(localStorage.getItem("role"));

        if (storedRole) {
          clearInterval(checkRole);

          if (storedRole === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      }, 100);

    } catch (err) {
      console.log(err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        default:
          setError("Login failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F2EF] px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        <h2 className="text-3xl font-serif text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Login to your account
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e7b6a1] outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e7b6a1] outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-full 
            hover:scale-105 hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#e7b6a1] font-medium">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;