import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#111] to-black text-gray-300 mt-24">

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 💎 BRAND */}
        <div>
          <h2 className="text-2xl font-serif tracking-widest text-white mb-4">
            ZEWELRA
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed">
            Handcrafted luxury jewelry for those who appreciate timeless elegance.  
            Every piece tells a story of artistry and devotion.
          </p>

          {/* 🌐 SOCIAL */}
          <div className="flex gap-4 mt-6">
            {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedin].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e7b6a1] hover:text-black transition cursor-pointer"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* 🛍️ COLLECTIONS */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            COLLECTIONS
          </h3>

          <ul className="space-y-3 text-sm">
            <li><Link to="/products" className="hover:text-[#e7b6a1]">Rings</Link></li>
            <li><Link to="/products" className="hover:text-[#e7b6a1]">Necklaces</Link></li>
            <li><Link to="/products" className="hover:text-[#e7b6a1]">Earrings</Link></li>
            <li><Link to="/products" className="hover:text-[#e7b6a1]">Bracelets</Link></li>
          </ul>
        </div>

        {/* 🛠️ SERVICES */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            SERVICES
          </h3>

          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="hover:text-[#e7b6a1]">Custom Design</Link></li>
            <li><span className="hover:text-[#e7b6a1] cursor-pointer">Ring Sizing</span></li>
            <li><span className="hover:text-[#e7b6a1] cursor-pointer">Engraving</span></li>
            <li><span className="hover:text-[#e7b6a1] cursor-pointer">Gift Wrapping</span></li>
          </ul>
        </div>

        {/* 🏢 COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            COMPANY
          </h3>

          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-[#e7b6a1]">Our Story</Link></li>
            <li><span className="hover:text-[#e7b6a1] cursor-pointer">Craftsmanship</span></li>
            <li><span className="hover:text-[#e7b6a1] cursor-pointer">Sustainability</span></li>
            <li><Link to="/contact" className="hover:text-[#e7b6a1]">Contact Us</Link></li>
          </ul>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">

        <p>© 2026 Zewelra. All rights reserved.</p>

        <div className="flex gap-6">
          <span className="hover:text-[#e7b6a1] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#e7b6a1] cursor-pointer">Terms of Service</span>
          <span className="hover:text-[#e7b6a1] cursor-pointer">Shipping Policy</span>
        </div>

      </div>

    </footer>
  );
};

export default Footer;