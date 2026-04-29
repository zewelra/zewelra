import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

/* ================= IMPORT IMAGES ================= */
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";
import p5 from "../assets/p5.jpg";
import p6 from "../assets/p6.jpg";
import p7 from "../assets/p7.jpg";
import p8 from "../assets/p8.jpg";

/* ================= DATA ================= */
const allProducts = [
  { id: 1, name: "Diamond Tennis Bracelet", price: 4, oldPrice: 4800, category: "Bracelets", image: p1, tag: "SALE", rating: 5, reviews: 38 },
  { id: 2, name: "Rose Petal Diamond Ring", price: 2850, oldPrice: 3200, category: "Rings", image: p2, tag: "BESTSELLER", rating: 5, reviews: 128 },
  { id: 3, name: "Infinity Gold Bracelet", price: 1280, oldPrice: 1500, category: "Bracelets", image: p3, tag: "SALE", rating: 5, reviews: 112 },
  { id: 4, name: "Golden Vine Necklace", price: 2100, category: "Necklaces", image: p4, tag: "BESTSELLER", rating: 5, reviews: 156 },
  { id: 5, name: "Celestial Pearl Necklace", price: 1650, category: "Necklaces", image: p5, tag: "NEW", rating: 5, reviews: 94 },
  { id: 6, name: "Moonlight Sapphire Ring", price: 3450, category: "Rings", image: p6, tag: "NEW", rating: 5, reviews: 45 },
  { id: 7, name: "Aurora Drop Earrings", price: 980, category: "Earrings", image: p7, tag: "NEW", rating: 5, reviews: 67 },
  { id: 8, name: "Vintage Lace Earrings", price: 760, category: "Earrings", image: p8, tag: "", rating: 5, reviews: 83 }
];

const categories = ["All Jewelry", "Rings", "Necklaces", "Earrings", "Bracelets"];

const Products = () => {
  const location = useLocation();

  const [category, setCategory] = useState("All Jewelry");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(5000);

  /* ================= SEARCH PARAM ================= */
  const query = new URLSearchParams(location.search);
  const search = query.get("search")?.toLowerCase() || "";

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let data = [...allProducts];

    // 🔍 SEARCH
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search)
      );
    }

    // 📂 CATEGORY
    if (category !== "All Jewelry") {
      data = data.filter((p) => p.category === category);
    }

    // 💰 PRICE
    data = data.filter((p) => p.price <= maxPrice);

    // 🔃 SORT
    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);

    return data;
  }, [category, sort, maxPrice, search]);

  return (
    <div className="bg-[#F6F2EF] min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="text-center py-16 px-4 bg-[#efe7e3]">
        <p className="uppercase text-xs tracking-[3px] text-gray-400 mb-3">
          Our Collection
        </p>

        <h1 className="text-5xl font-serif mb-4">
          Fine Jewelry
        </h1>

        <p className="text-gray-500">
          Discover our complete collection of handcrafted luxury pieces
        </p>

        {search && (
          <p className="mt-4 text-sm text-[#e7b6a1]">
            Showing results for: "{search}"
          </p>
        )}
      </div>

      {/* ================= MAIN ================= */}
      <div className="px-6 md:px-16 py-12 flex gap-10">

        {/* ================= SIDEBAR ================= */}
        <div className="hidden md:block w-64">

          <p className="text-sm text-gray-400 mb-6">
            {filtered.length} products found
          </p>

          {/* CATEGORY */}
          <div className="mb-10">
            <h3 className="text-xs tracking-widest text-gray-400 mb-4">
              CATEGORY
            </h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-lg transition
                    ${
                      category === cat
                        ? "bg-black text-white"
                        : "text-gray-600 hover:text-black"
                    }`}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="mb-10">
            <h3 className="text-xs tracking-widest text-gray-400 mb-4">
              PRICE
            </h3>

            <div className="text-sm text-gray-500 mb-2">
              Up to ₹{maxPrice}
            </div>

            <input
              type="range"
              min="0"
              max="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-black"
            />
          </div>

          {/* SORT */}
          <div>
            <h3 className="text-xs tracking-widest text-gray-400 mb-4">
              SORT BY
            </h3>

            <div className="space-y-2 text-sm">
              <p
                onClick={() => setSort("popular")}
                className={sort === "popular" ? "font-medium" : "text-gray-500"}
              >
                Most Popular
              </p>

              <p
                onClick={() => setSort("low")}
                className={sort === "low" ? "font-medium" : "text-gray-500"}
              >
                Price: Low → High
              </p>

              <p
                onClick={() => setSort("high")}
                className={sort === "high" ? "font-medium" : "text-gray-500"}
              >
                Price: High → Low
              </p>
            </div>
          </div>

        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="flex-1">

          {filtered.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-500 text-lg">
                No products found 😔
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Products;