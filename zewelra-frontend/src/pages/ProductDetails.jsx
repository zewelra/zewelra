import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/* ================= IMAGES ================= */
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";
import p5 from "../assets/p5.jpg";
import p6 from "../assets/p6.jpg";
import p7 from "../assets/p7.jpg";
import p8 from "../assets/p8.jpg";

/* ================= ALL PRODUCTS ================= */
const allProducts = [
  { id: 1, name: "Diamond Tennis Bracelet", price: 4200, category: "Bracelets", image: p1 },
  { id: 2, name: "Rose Petal Diamond Ring", price: 2850, category: "Rings", image: p2 },
  { id: 3, name: "Infinity Gold Bracelet", price: 1280, category: "Bracelets", image: p3 },
  { id: 4, name: "Golden Vine Necklace", price: 2100, category: "Necklaces", image: p4 },
  { id: 5, name: "Celestial Pearl Necklace", price: 1650, category: "Necklaces", image: p5 },
  { id: 6, name: "Moonlight Sapphire Ring", price: 3450, category: "Rings", image: p6 },
  { id: 7, name: "Aurora Drop Earrings", price: 980, category: "Earrings", image: p7 },
  { id: 8, name: "Vintage Lace Earrings", price: 760, category: "Earrings", image: p8 }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = allProducts.find((p) => p.id === Number(id));

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(product?.image);

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  /* ================= RELATED ================= */
  const related = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-16">

      <div className="grid md:grid-cols-2 gap-16">

        {/* ================= IMAGE GALLERY ================= */}
        <div>

          {/* MAIN IMAGE */}
          <img
            src={activeImg}
            alt={product.name}
            className="w-full rounded-2xl shadow-lg"
          />

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4">
            {[product.image, product.image, product.image].map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImg(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  activeImg === img ? "border-black" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div>

          <h1 className="text-4xl font-serif mb-3">
            {product.name}
          </h1>

          {/* ⭐ RATING */}
          <div className="text-yellow-400 mb-3">★★★★★ (124 reviews)</div>

          <p className="text-2xl text-[#e7b6a1] font-semibold mb-6">
            ₹{product.price}
          </p>

          <p className="text-gray-500 mb-6 leading-relaxed">
            This handcrafted jewelry piece is designed with precision and elegance,
            ensuring timeless beauty and unmatched quality.
          </p>

          {/* 🔢 QUANTITY */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
              className="px-3 py-1 border rounded"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mb-6">

            <button
              onClick={() =>
                addToCart({ ...product, qty })
              }
              className="bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>

          </div>

          {/* FEATURES */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>✔ Premium Quality Materials</p>
            <p>✔ 1 Year Warranty</p>
            <p>✔ Free Shipping</p>
            <p>✔ Easy Returns</p>
          </div>

        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <div className="mt-24">

        <h2 className="text-3xl font-serif mb-10 text-center">
          You May Also Like
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

          {related.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="cursor-pointer group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-xl group-hover:scale-105 transition"
              />

              <h3 className="mt-3">{item.name}</h3>
              <p className="text-[#e7b6a1]">₹{item.price}</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default ProductDetails;