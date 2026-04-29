import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
  FaRupeeSign,
  FaCheckCircle
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// FIREBASE
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

const UserDashboard = () => {
  const { cart = [], wishlist = [], totalItems } = useCart();
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const name = currentUser?.displayName || "User";
  const email = currentUser?.email || "No email";

  /* ================= FETCH ================= */
  useEffect(() => {
  if (!currentUser) return;

  const q = query(
    collection(db, "orders"),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setOrders(data);
    setLoading(false);
  });

  return () => unsubscribe();
}, [currentUser]);
  /* ================= DERIVED ================= */
  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const recentOrders = orders.slice(0, 3);

  /* ================= STATUS STEPS ================= */
  const steps = ["Processing", "Confirmed", "Shipped", "Delivered"];

  const getStepIndex = (status) => steps.indexOf(status);

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif">
          Welcome, <span className="text-[#e7b6a1]">{name}</span>
        </h1>
        <p className="text-gray-500 mt-2">{email}</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card icon={<FaShoppingCart />} title="Cart Items" value={totalItems} />
        <Card icon={<FaHeart />} title="Wishlist" value={wishlist.length} />
        <Card icon={<FaBoxOpen />} title="Orders" value={orders.length} />
        <Card icon={<FaRupeeSign />} title="Total Spent" value={`₹${totalSpent}`} />
      </div>

      {/* QUICK */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <QuickCard to="/orders" title="My Orders" desc="Track your orders" />
        <QuickCard to="/wishlist" title="Wishlist" desc="Saved products" />
        <QuickCard to="/profile" title="Profile" desc="Manage account" />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-2xl font-serif mb-6">
          Order Tracking
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="space-y-6">

            {recentOrders.map((order) => {
              const currentStep = getStepIndex(order.status);

              return (
                <div key={order.id} className="border rounded-xl p-4">

                  {/* HEADER */}
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold">
                        Order #{order.id.slice(0, 6)}
                      </p>
                      <p className="text-sm text-gray-400">
                        ₹{order.total}
                      </p>
                    </div>

                    <span className="text-sm px-3 py-1 rounded-full bg-[#e7b6a1]/20 text-[#e7b6a1]">
                      {order.paymentMethod === "cod" ? "COD" : "Online"}
                    </span>
                  </div>

                  {/* TIMELINE */}
                  <div className="flex items-center justify-between">

                    {steps.map((step, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center relative">

                        {/* LINE */}
                        {i !== 0 && (
                          <div
                            className={`absolute top-3 left-[-50%] w-full h-[2px]
                            ${i <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
                          />
                        )}

                        {/* DOT */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                          ${
                            i <= currentStep
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-white"
                          }`}
                        >
                          {i <= currentStep ? <FaCheckCircle /> : i + 1}
                        </div>

                        {/* LABEL */}
                        <p className="text-xs mt-2 text-center">{step}</p>

                      </div>
                    ))}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* CART */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-serif mb-6">
          Recently Added
        </h2>

        {cart.length === 0 ? (
          <p>No items</p>
        ) : (
          <div className="space-y-4">
            {cart.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-3">
                <div className="flex gap-3">
                  <img src={item.image} className="w-14 h-14 rounded" />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>
                <p className="text-[#e7b6a1]">₹{item.price}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

/* CARD */
const Card = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <div className="flex justify-between mb-2">
      <p className="text-gray-400">{title}</p>
      {icon}
    </div>
    <h2 className="text-xl font-semibold">{value}</h2>
  </div>
);

/* QUICK */
const QuickCard = ({ to, title, desc }) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition"
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </Link>
);

export default UserDashboard;