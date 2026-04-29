import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ FIXED
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useCart } from "../context/CartContext";

/* ================= IMAGES ================= */
import heroImg from "../assets/hero.jpg";

import ringImg from "../assets/ring.jpg";
import necklaceImg from "../assets/necklace.jpg";
import earringsImg from "../assets/earrings.jpg";
import braceletImg from "../assets/bracelet.jpg";

import ringImg2 from "../assets/ring1.jpg";
import necklaceImg2 from "../assets/necklace1.jpg";
import earringsImg2 from "../assets/earrings1.jpg";
import braceletImg2 from "../assets/bracelet1.jpg";

import storyImg from "../assets/story.jpg";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";
import user3 from "../assets/user3.jpg";

const Home = () => {
  const navigate = useNavigate(); // ✅ FIXED
  const { addToCart } = useCart();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#F6F2EF] text-gray-800 overflow-hidden"
    >

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center">
        <motion.img
          src={heroImg}
          alt="Luxury Jewelry"
          style={{ y }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6 }}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="relative z-10 px-10 md:px-20 text-white max-w-2xl"
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="uppercase tracking-[3px] text-sm mb-4"
          >
            New Collection 2025
          </motion.p>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
            className="text-6xl md:text-7xl font-serif leading-tight mb-6"
          >
            Timeless <br />
            <span className="text-[#e7b6a1]">Elegance</span> <br />
            in Every Detail
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-300 mb-8 leading-relaxed"
          >
            Discover handcrafted luxury jewelry — each piece a testament to artistry,
            passion, and timeless beauty.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex gap-4"
          >
            <Link to="/products">
              <button className="bg-white text-black px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition">
                Shop Now
              </button>
            </Link>

            <Link to="/products">
              <button className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition">
                Explore Collection
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

            {/* ================= COLLECTION ================= */}
      <section className="py-28 px-6 md:px-20">
        <div className="flex justify-between items-end mb-14">
          <div>
            <p className="uppercase text-sm text-gray-400 mb-2">
              Our Collections
            </p>
            <h2 className="text-4xl font-serif">
              Shop by <span className="text-[#e7b6a1]">Category</span>
            </h2>
          </div>

          <Link to="/products">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:scale-105 transition">
              Explore All →
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Rings", img: ringImg, text: "Symbols of eternal love", count: "24 pieces" },
            { name: "Necklaces", img: necklaceImg, text: "Grace around your neck", count: "18 pieces" },
            { name: "Earrings", img: earringsImg, text: "Frame your beauty", count: "32 pieces" },
            { name: "Bracelets", img: braceletImg, text: "Adorn your wrists", count: "15 pieces" }
          ].map((item, i) => (
            <Link key={i} to={`/products?category=${item.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.06 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <motion.img
                  src={item.img}
                  alt={item.name}
                  className="h-80 w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex flex-col justify-end text-white">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-200">{item.text}</p>
                  <span className="text-xs text-[#e7b6a1] mt-1">{item.count}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

            {/* ================= BEST SELLERS ================= */}
      <section ref={ref} className="py-28 px-6 md:px-20 bg-white text-center">
        <p className="uppercase text-sm text-gray-400 mb-2">Most Loved</p>

        <h2 className="text-5xl font-serif mb-4">Best Sellers</h2>

        <p className="text-gray-500 mb-14 max-w-xl mx-auto">
          Our most coveted pieces, chosen by those who appreciate the finest craftsmanship
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { img: ringImg2, badge: "Bestseller", name: "Rose Petal Diamond Ring", price: "$2,850", old: "$3,200" },
            { img: necklaceImg2, badge: "New", name: "Celestial Pearl Necklace", price: "$1,650" },
            { img: braceletImg2, badge: "Sale", name: "Infinity Gold Bracelet", price: "$1,280", old: "$1,500" },
            { img: earringsImg2, badge: "New", name: "Moonlight Sapphire Ring", price: "$3,450" }
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-xl">

                {/* ✅ CLICKABLE IMAGE */}
                <motion.img
                  src={p.img}
                  alt={p.name}
                  onClick={() => navigate(`/product/${i + 1}`)}
                  className="rounded-xl w-full cursor-pointer"
                  whileHover={{ scale: 1.12 }}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

                <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                  {p.badge}
                </span>

                <span className="absolute top-3 right-3 bg-white p-2 rounded-full">❤️</span>

                {/* ✅ WORKING ADD TO CART */}
                <button
                  onClick={() =>
                    addToCart({
                      id: i + 1,
                      name: p.name,
                      price: parseInt(p.price.replace(/[^0-9]/g, "")),
                      image: p.img
                    })
                  }
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  Add to Cart
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3">Jewelry</p>
              <h3 className="font-medium">{p.name}</h3>

              <div className="text-yellow-400 text-sm">★★★★★</div>

              <div className="flex gap-2">
                <p className="text-[#e7b6a1] font-semibold">{p.price}</p>
                {p.old && <p className="text-gray-400 line-through text-sm">{p.old}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-28 px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center">
        <motion.img
          src={storyImg}
          alt="Crafting Jewelry"
          className="rounded-2xl"
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
        />

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
        >
          <p className="uppercase text-sm text-gray-400 mb-3">Our Story</p>

          <h2 className="text-5xl font-serif mb-6">
            Crafted with <span className="text-[#e7b6a1]">Passion</span> & Precision
          </h2>

          <p className="text-gray-600 mb-4">
            Since 1987, Lumière has been creating extraordinary jewelry that transcends time.
          </p>

          <p className="text-gray-600 mb-6">
            Every gemstone is hand-selected, every setting meticulously crafted.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {["1987", "50K+", "200+", "38"].map((n, i) => (
              <div key={i}>
                <p className="font-bold">{n}</p>
                <p className="text-xs text-gray-400">
                  {["Est.", "Clients", "Designs", "Countries"][i]}
                </p>
              </div>
            ))}
          </div>

          <Link to="/about">
            <button className="bg-black text-white px-6 py-2 rounded-full">
              Our Story →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-28 px-6 md:px-20 bg-[#EFE7E3] text-center">
        <p className="uppercase text-sm text-gray-400 mb-2">
          Client Stories
        </p>

        <h2 className="text-5xl font-serif mb-12">Words of Love</h2>

        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Hear from those who wear our pieces every day
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              text: "The Rose Petal Diamond Ring exceeded every expectation. The craftsmanship is extraordinary — it catches light in the most magical way. I receive compliments every single day.",
              name: "Sophia Laurent",
              role: "Fashion Editor",
              img: user1
            },
            {
              text: "Lumière's packaging alone is a work of art. The Celestial Pearl Necklace arrived in the most beautiful box. The quality is unmatched — these are heirloom pieces.",
              name: "Isabella Chen",
              role: "Interior Designer",
              img: user2
            },
            {
              text: "I've purchased from many luxury brands, but Lumière stands apart. The attention to detail in the Aurora Drop Earrings is breathtaking. Truly museum-worthy pieces.",
              name: "Amélie Rousseau",
              role: "Luxury Lifestyle Blogger",
              img: user3
            }
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition"
            >
              {/* ⭐ Stars */}
              <div className="text-yellow-400 mb-3 text-sm">★★★★★</div>

              {/* 💬 Text */}
              <p className="italic text-gray-700 leading-relaxed mb-5">
                “{t.text}”
              </p>

              {/* 👤 User */}
              <div className="flex items-center gap-3 justify-center">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
            {/* ================= NEWSLETTER ================= */}
      <section className="py-28 text-center bg-black text-white">
        <h2 className="text-4xl font-serif mb-4">Join the Zewelra Circle</h2>

        <p className="text-gray-400 mb-6">
          Get exclusive offers & updates
        </p>

        <div className="flex justify-center gap-2">
          <input
            className="px-4 py-3 rounded bg-gray-800 w-64"
            placeholder="Your email"
          />

          {/* ✅ FIXED BUTTON */}
          <button
            onClick={() => alert("Subscribed Successfully")}
            className="bg-[#e7b6a1] px-6 py-3 rounded text-black font-medium hover:scale-105 transition"
          >
            Subscribe
          </button>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;