import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ================= IMAGE ================= */
import heroImg from "../assets/contact-hero.jpg";

const ContactPage = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [active, setActive] = useState(null);

  const faqs = [
    {
      q: "Do you offer custom jewelry design?",
      a: "Yes, Zewelra offers fully personalized jewelry crafted to your vision."
    },
    {
      q: "What is your delivery time?",
      a: "5–7 working days across India."
    },
    {
      q: "Can I visit your store?",
      a: "Yes, our boutique is located in Patiala."
    },
    {
      q: "Do you provide authenticity certificates?",
      a: "Yes, all products come with certification."
    }
  ];

  return (
    <div className="bg-[#F6F2EF] text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <motion.img
          src={heroImg}
          style={{ y }}
          className="absolute w-full h-full object-cover"
          alt="Zewelra Store"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white">
          <p className="uppercase tracking-[4px] text-sm mb-4">
            Get In Touch
          </p>

          <h1 className="text-5xl md:text-6xl font-serif">
            We'd Love to <br />
            <span className="text-[#e7b6a1]">Hear From You</span>
          </h1>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        ref={ref}
        className="py-24 px-6 md:px-20 grid md:grid-cols-2 gap-16"
      >
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
        >
          <p className="text-sm uppercase text-gray-400 mb-2">
            Contact Information
          </p>

          <h2 className="text-4xl font-serif mb-10">
            Let's <span className="text-[#e7b6a1]">Connect</span>
          </h2>

          {/* CARDS */}
          <div className="space-y-6">

            {/* CARD */}
            <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-transparent hover:border-[#e7b6a1]/30">
              <div className="flex items-start gap-4">

                <div className="bg-[#F6F2EF] p-3 rounded-lg text-xl">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Visit Us</h3>
                  <p className="text-gray-500 text-sm">
                    Patiala, Punjab, India
                  </p>
                  <p className="text-[#e7b6a1] text-xs mt-2 cursor-pointer">
                    Get Directions →
                  </p>
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-transparent hover:border-[#e7b6a1]/30">
              <div className="flex items-start gap-4">

                <div className="bg-[#F6F2EF] p-3 rounded-lg text-xl">
                  📧
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-gray-500 text-sm">
                    support@zewelra.com
                  </p>
                  <p className="text-gray-500 text-sm">
                    contact@zewelra.com
                  </p>
                  <p className="text-[#e7b6a1] text-xs mt-2 cursor-pointer">
                    Send Email →
                  </p>
                </div>
              </div>
            </div>

            {/* PHONE */}
            <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-transparent hover:border-[#e7b6a1]/30">
              <div className="flex items-start gap-4">

                <div className="bg-[#F6F2EF] p-3 rounded-lg text-xl">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-500 text-sm">
                    +91 98765 43210
                  </p>
                  <p className="text-gray-500 text-sm">
                    Mon–Sat: 10am–7pm
                  </p>
                  <p className="text-[#e7b6a1] text-xs mt-2 cursor-pointer">
                    Call Now →
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* RIGHT SIDE MAP */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=patiala&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[450px] border-0"
          />
        </motion.div>
      </section>

      {/* ================= FORM ================= */}
      <section className="py-24 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-serif mb-10">
          How Can We Help?
        </h2>

        <div className="max-w-4xl mx-auto p-10 rounded-2xl 
bg-[#fdf8f5]/80 backdrop-blur-md 
border border-[#e7b6a1]/20 
shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <div className="grid md:grid-cols-2 gap-6">

            <input className="input" placeholder="Full Name" />
            <input className="input" placeholder="Email Address" />
            <input className="input" placeholder="Phone Number" />

            <select className="w-full px-4 py-3 rounded-lg 
bg-white/70 border border-gray-200 
focus:outline-none focus:ring-2 focus:ring-[#e7b6a1] 
transition">
              <option>Select Inquiry Type</option>
              <option>Order</option>
              <option>Custom Jewelry</option>
            </select>

          </div>

          <textarea
            className="input mt-6 w-full"
            rows="5"
            placeholder="Your Message"
          />

          <button className="mt-6 bg-gradient-to-r from-black to-gray-800 
text-white px-8 py-3 rounded-full 
hover:scale-105 hover:shadow-lg 
transition duration-300">
            Send Message →
          </button>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-24 px-6 md:px-20">
        <h2 className="text-4xl font-serif text-center mb-12">
          Common <span className="text-[#e7b6a1]">Questions</span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className="bg-white p-5 rounded-xl shadow cursor-pointer"
            >
              <div className="flex justify-between">
                <span>{item.q}</span>
                <span>{active === i ? "−" : "+"}</span>
              </div>

              {active === i && (
                <p className="text-gray-500 mt-3 text-sm">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ContactPage;