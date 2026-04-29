import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaHeart,
  FaSignOutAlt,
  FaUserShield
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const userMenuRef = useRef();

  const { cart = [] } = useCart();
  const { currentUser, logout, isAdmin, role } = useAuth();

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  /* ================= 🔥 ADMIN ONLY VIEW ================= */
  if (currentUser && isAdmin) {
    return (
      <nav className="sticky top-0 z-50 bg-black text-white px-6 md:px-12 py-4 flex justify-between items-center">

        <h1 className="text-xl font-serif tracking-widest">
          ZEWELRA ADMIN
        </h1>

        <div className="flex items-center gap-4">

          <Link
            to="/admin"
            className="px-4 py-2 rounded-full bg-white text-black text-sm"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400"
          >
            <FaSignOutAlt /> Logout
          </button>

        </div>

      </nav>
    );
  }

  /* ================= NORMAL USER NAVBAR ================= */
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">

      <div className="flex justify-between items-center px-6 md:px-12 py-4">

        {/* LOGO */}
        <Link to="/">
          <h1 className="text-2xl font-serif tracking-widest hover:text-[#e7b6a1] transition">
            ZEWELRA
          </h1>
        </Link>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/70 px-4 py-2 rounded-full border w-80 focus-within:ring-2 focus-within:ring-[#e7b6a1]"
        >
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search jewelry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm"
          />
        </form>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-10 text-sm font-medium">
          {navLinks.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `relative group ${
                  isActive ? "text-[#e7b6a1]" : "text-gray-700"
                }`
              }
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#e7b6a1] group-hover:w-full transition-all"></span>
            </NavLink>
          ))}
        </div>

        {/* ICONS */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">

          {/* ❤️ */}
          <Link to="/wishlist" className="hover:text-[#e7b6a1]">
            <FaHeart />
          </Link>

          {/* 🛒 */}
          <Link to="/cart" className="relative hover:text-[#e7b6a1]">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e7b6a1] text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          <div className="relative" ref={userMenuRef}>
            <FaUser
              className="cursor-pointer hover:text-[#e7b6a1]"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />

            {showUserMenu && (
              <div className="absolute right-0 mt-4 w-60 bg-white border rounded-xl shadow-xl overflow-hidden">

                {!currentUser ? (
                  <>
                    <Link className="block px-4 py-3 hover:bg-[#f6f2ef]" to="/login">
                      Login
                    </Link>
                    <Link className="block px-4 py-3 hover:bg-[#f6f2ef]" to="/signup">
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    {/* USER INFO */}
                    <div className="px-4 py-3 border-b text-sm">
                      <p className="font-semibold">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {currentUser.email}
                      </p>
                    </div>

                    {/* ADMIN ENTRY */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-[#e7b6a1] hover:bg-[#f6f2ef]"
                      >
                        <FaUserShield /> Admin Dashboard
                      </Link>
                    )}

                    <Link className="block px-4 py-3 hover:bg-[#f6f2ef]" to="/profile">
                      Profile
                    </Link>

                    <Link className="block px-4 py-3 hover:bg-[#f6f2ef]" to="/orders">
                      Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-[#f6f2ef]"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                )}

              </div>
            )}
          </div>

        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden">
          {menuOpen ? (
            <FaTimes size={22} onClick={() => setMenuOpen(false)} />
          ) : (
            <FaBars size={22} onClick={() => setMenuOpen(true)} />
          )}
        </div>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-6 flex flex-col gap-5">

          <form onSubmit={handleSearch} className="flex border rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400 mt-1" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {navLinks.map((item, i) => (
            <Link key={i} to={item.path} onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-4 border-t">

            {currentUser ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-[#e7b6a1]">
                    Admin Dashboard
                  </Link>
                )}

                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>

                <button onClick={handleLogout} className="text-red-500 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}

          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;