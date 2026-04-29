import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ================= IMAGES ================= */
import heroImg from "../assets/about-hero.jpg";
import storyImg from "../assets/about-story.jpg";

import process1 from "../assets/process1.jpg";
import process2 from "../assets/process2.jpg";
import process3 from "../assets/process3.jpg";
import process4 from "../assets/process4.jpg";

import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";

import ctaImg from "../assets/cta.jpg";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

/* ================= PROCESS ITEM ================= */
const StepItem = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const isLeft = index % 2 === 0;
  

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-16 items-center ${
        !isLeft ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* IMAGE */}
      <motion.div
        variants={isLeft ? fadeLeft : fadeRight}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative"
      >
        <motion.img
          src={step.img}
          alt={step.title}
          style={{ y }}
          className="rounded-2xl w-full max-w-sm mx-auto 
h-[320px] object-cover shadow-lg 
hover:scale-105 transition duration-500"
        />

        {/* BADGE */}
        <div className="absolute -top-4 -right-4 bg-black text-white w-14 h-14 flex items-center justify-center rounded-xl text-sm font-semibold shadow-xl">
          {step.number}
        </div>
      </motion.div>

      {/* TEXT */}
      <motion.div
        variants={isLeft ? fadeRight : fadeLeft}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <h3 className="text-3xl font-serif mb-4">{step.title}</h3>
        <p className="text-gray-500 leading-relaxed max-w-md">
          {step.desc}
        </p>
        <div className="w-16 h-[2px] bg-[#e7b6a1] mt-4"></div>
      </motion.div>
    </div>
  );
};

/* ================= MAIN ================= */

const AboutPage = () => {
    const navigate = useNavigate(); 

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const steps = [
    {
      number: "01",
      title: "Design",
      img: process1,
      desc: "Every piece begins as a sketch, inspired by the world around us. Our designers spend weeks perfecting each curve and angle."
    },
    {
      number: "02",
      title: "Selection",
      img: process2,
      desc: "We travel the world to source only the finest gemstones — diamonds with exceptional fire, pearls with perfect luster."
    },
    {
      number: "03",
      title: "Creation",
      img: process3,
      desc: "Our master craftsmen bring designs to life using techniques refined over decades. Every setting is placed by hand."
    },
    {
      number: "04",
      title: "Perfection",
      img: process4,
      desc: "Each piece undergoes rigorous quality control. Only when it meets our exacting standards does it earn the Lumière name."
    }
  ];

  return (
    <div className="bg-[#F6F2EF] text-gray-800 overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <motion.img
          src={heroImg}
          alt="Hero"
          style={{ y: yHero }}
          className="absolute w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center text-white px-6"
        >
          <p className="uppercase tracking-[4px] mb-4 text-sm">SINCE 1987</p>
          <h1 className="text-6xl md:text-7xl font-serif mb-6">
            The Art of <br />
            <span className="text-[#e7b6a1]">Timeless Beauty</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Where passion meets precision, and every piece tells a story of devotion.
          </p>
        </motion.div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-28 px-6 md:px-20 grid md:grid-cols-2 gap-20 items-center bg-white">
        <motion.div variants={fadeLeft} initial="hidden" whileInView="show">
          <p className="uppercase text-sm text-gray-400 mb-3">OUR HERITAGE</p>

          <h2 className="text-5xl font-serif mb-6">
            A Legacy Built on <span className="text-[#e7b6a1]">Passion</span>
          </h2>

          <p className="text-gray-600 mb-4">
            In the heart of Paris, 1987, a young artisan named Élise Lumière opened a small atelier with a singular vision.
          </p>

          <p className="text-gray-600 mb-4">
            Every Lumière piece begins with a story — a moment of inspiration drawn from nature and life.
          </p>

          <p className="text-gray-600">
            Each creation carries a piece of our history and a promise of enduring beauty.
          </p>
        </motion.div>

        <motion.img
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          src={storyImg}
          alt="Story"
          className="rounded-3xl shadow-xl w-full max-w-lg mx-auto 
hover:scale-105 transition duration-500"
        />
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-28 px-6 md:px-20 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <p className="uppercase text-sm text-gray-400 mb-2">THE PROCESS</p>
          <h2 className="text-5xl font-serif mb-4">
            From Vision to <span className="text-[#e7b6a1]">Reality</span>
          </h2>
          <p className="text-gray-500 mb-16">
            Our four-step journey transforms inspiration into heirloom-quality jewelry
          </p>
        </motion.div>

        <div className="space-y-28">
          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-28 px-6 md:px-20 bg-white text-center">
        <h2 className="text-5xl font-serif mb-12">
          Values That <span className="text-[#e7b6a1]">Define Us</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            "Handcrafted with Love",
            "Sustainable Luxury",
            "Uncompromising Quality",
            "Timeless Design"
          ].map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`p-6 rounded-xl transition ${
                i === 3
                  ? "bg-black text-white"
                  : "bg-[#F6F2EF]"
              }`}
            >
              <h3 className="font-semibold">{v}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-28 px-6 md:px-20 text-center">
        <h2 className="text-5xl font-serif mb-12">Meet the Makers</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[team1, team2, team3].map((img, i) => (
            <motion.div key={i} whileHover={{ y: -10 }}>
              <motion.img
                src={img}
                alt="Team"
                className="rounded-2xl w-full max-w-xs mx-auto 
h-[260px] object-cover shadow-lg 
hover:scale-105 transition duration-500"
              />
              <p className="mt-3 font-semibold">Artisan {i + 1}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-32 text-center text-white">
        <img src={ctaImg} alt="CTA" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-black/70" />

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="relative z-10">
          <h2 className="text-4xl font-serif mb-4">
            Begin Your Zewelra Journey
          </h2>
          <p className="text-gray-300 mb-6">
            Discover pieces that speak to your soul.
          </p>
          <button
  onClick={() => navigate("/products")}
  className="bg-white text-black px-8 py-3 rounded-full 
  hover:scale-105 hover:bg-[#e7b6a1] hover:text-white 
  active:scale-95 transition duration-300 shadow-md"
>
  Explore Collection →
</button>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutPage;