import React, { useState } from "react";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const liked = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  /* ================= HANDLERS ================= */
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);

    // ✅ feedback animation
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const goToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden 
      bg-[#fdf8f5] border border-[#e7b6a1]/20 
      shadow-sm hover:shadow-xl hover:-translate-y-2 
      transition duration-300"
    >

      {/* ================= IMAGE ================= */}
      <div className="relative overflow-hidden cursor-pointer" onClick={goToDetails}>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-72 object-cover 
          group-hover:scale-110 transition duration-500"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>

        {/* BADGE */}
        {product.tag && (
          <span
            className={`absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full font-medium tracking-wide
            ${
              product.tag === "SALE"
                ? "bg-pink-200 text-pink-800"
                : product.tag === "BESTSELLER"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-black text-white"
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* ❤️ WISHLIST */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow backdrop-blur transition
          ${
            liked
              ? "bg-red-500 text-white scale-110"
              : "bg-white/80 hover:bg-[#e7b6a1] hover:text-white"
          }`}
        >
          <FaHeart size={14} />
        </button>

        {/* 👁 VIEW */}
        <div className="absolute inset-0 flex justify-center items-center 
        opacity-0 group-hover:opacity-100 transition">

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            className="bg-white/90 backdrop-blur p-3 rounded-full shadow 
            hover:bg-[#e7b6a1] hover:text-white transition"
          >
            <FaEye />
          </button>
        </div>

        {/* 🛒 ADD TO CART */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center 
        opacity-0 group-hover:opacity-100 transition">

          <button
            onClick={handleAddToCart}
            className={`px-6 py-2 rounded-full text-sm transition
            ${
              added
                ? "bg-green-500 text-white"
                : "bg-black text-white hover:bg-[#e7b6a1]"
            }`}
          >
            {added ? "Added ✓" : "ADD TO CART"}
          </button>
        </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5">

        {/* CATEGORY */}
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          {product.category}
        </p>

        {/* NAME */}
        <h3
          onClick={goToDetails}
          className="font-semibold text-lg font-serif line-clamp-1 cursor-pointer hover:text-[#e7b6a1]"
        >
          {product.name}
        </h3>

        {/* ⭐ RATING */}
        <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
          {[...Array(product.rating || 5)].map((_, i) => (
            <FaStar key={i} />
          ))}
          <span className="text-gray-400 ml-1 text-xs">
            ({product.reviews || 0})
          </span>
        </div>

        {/* 💰 PRICE */}
        <div className="mt-2 flex items-center gap-2">
          <p className="text-black font-semibold text-lg">
            ₹{product.price}
          </p>

          {product.oldPrice && (
            <p className="text-gray-400 line-through text-sm">
              ₹{product.oldPrice}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;