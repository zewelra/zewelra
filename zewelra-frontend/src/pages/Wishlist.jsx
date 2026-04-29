import React from "react";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      <h1 className="text-4xl font-serif mb-10">
        Your <span className="text-[#e7b6a1]">Wishlist</span>
      </h1>

      {/* ================= EMPTY ================= */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-center animate-fadeIn">

          <div className="w-24 h-24 rounded-full bg-white shadow flex items-center justify-center mb-6 text-3xl">
            ❤️
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Your Wishlist is Empty
          </h2>

          <p className="text-gray-500 mb-6 max-w-sm">
            Save items you love and revisit them anytime.
          </p>

          <Link
            to="/products"
            className="px-6 py-3 rounded-full 
            bg-gradient-to-r from-black to-gray-800 
            text-white hover:scale-105 transition"
          >
            Explore Collection →
          </Link>

        </div>
      ) : (
        /* ================= GRID ================= */
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {wishlist.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer bg-white/80 backdrop-blur rounded-2xl overflow-hidden 
              shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* BADGE */}
                {item.tag && (
                  <span className="absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full bg-black text-white">
                    {item.tag}
                  </span>
                )}

                {/* ❤️ REMOVE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow hover:scale-110 transition"
                >
                  <FaHeart size={14} />
                </button>

                {/* 👁 VIEW */}
                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${item.id}`);
                    }}
                    className="bg-white p-3 rounded-full shadow hover:bg-[#e7b6a1] hover:text-white transition"
                  >
                    <FaEye />
                  </button>
                </div>

              </div>

              {/* CONTENT */}
              <div className="p-5 text-center">

                {/* CATEGORY */}
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {item.category}
                </p>

                {/* NAME */}
                <h3 className="font-medium text-lg line-clamp-1">
                  {item.name}
                </h3>

                {/* ⭐ RATING */}
                <div className="flex justify-center text-yellow-400 text-sm mt-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* PRICE */}
                <div className="mt-2 flex justify-center gap-2">
                  <p className="text-[#e7b6a1] font-semibold">
                    ₹{item.price}
                  </p>

                  {item.oldPrice && (
                    <p className="text-gray-400 line-through text-sm">
                      ₹{item.oldPrice}
                    </p>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="mt-4 flex gap-2">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="flex-1 py-2 rounded-full 
                    bg-gradient-to-r from-black to-gray-800 
                    text-white hover:scale-105 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="px-3 rounded-full bg-red-500 text-white hover:scale-110 transition"
                  >
                    <FaHeart />
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Wishlist;