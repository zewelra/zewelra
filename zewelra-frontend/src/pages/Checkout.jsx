import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// FIREBASE
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Checkout = () => {
  const { cart = [], totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const RAZORPAY_KEY =
    process.env.REACT_APP_RAZORPAY_KEY || "";

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: currentUser.displayName || "",
        email: currentUser.email || ""
      }));
    }
  }, [currentUser]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Required";

    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Invalid phone";

    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.state.trim()) newErrors.state = "Required";

    if (!/^[0-9]{6}$/.test(form.pincode))
      newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= LOAD RAZORPAY ================= */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ================= SAVE ORDER ================= */
  const saveOrderToFirebase = async (response) => {
    const orderData = {
      userId: currentUser.uid,
      customer: form,
      items: cart,
      total: totalPrice,

      paymentMethod: "razorpay",
      paymentStatus: "Paid",

      // 🔥 IMPORTANT
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,

      status: "Processing",
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "orders"), orderData);
  };

  /* ================= HANDLE PAYMENT ================= */
  const handlePayment = async () => {
    if (!validate()) return;

    if (!currentUser) {
      alert("Login first");
      return navigate("/login");
    }

    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }

    setLoading(true);

    try {
      /* LOAD SDK */
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed");
        setLoading(false);
        return;
      }

      /* CREATE ORDER */
      const orderRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: totalPrice
        })
      });

      const data = await orderRes.json();

      if (!data.success) {
        alert("Order failed");
        setLoading(false);
        return;
      }

      const { order } = data;

      /* OPTIONS */
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "ZEWELRA",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await saveOrderToFirebase(response);

              clearCart();
              alert("Payment Successful 🎉");
              navigate("/orders");
            } else {
              alert("Verification failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification error");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
            setLoading(false);
          }
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },

        theme: {
          color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment error");
      setLoading(false);
    }
  };

  /* ================= EMPTY ================= */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Cart is empty</p>
        <Link to="/products">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      <h1 className="text-4xl font-serif text-center mb-10">
        Secure Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl mb-6">Shipping Details</h2>

          <div className="grid gap-4">
            {["name", "email", "phone"].map((f) => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleChange}
                placeholder={f}
                disabled={f === "email"}
                className="p-3 border rounded"
              />
            ))}

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-3 border rounded"
            />

            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="p-3 border rounded" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="p-3 border rounded" />
            <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="p-3 border rounded" />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl mb-6">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <div className="mt-4 font-bold flex justify-between">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 py-3 bg-black text-white rounded-full"
          >
            {loading ? "Processing..." : "Pay Now →"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;