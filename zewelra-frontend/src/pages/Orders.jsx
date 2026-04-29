import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// 🔥 FIREBASE
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

const { jsPDF } = window.jspdf;

const Orders = () => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= REALTIME FETCH ================= */
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

  /* ================= DOWNLOAD INVOICE ================= */
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    /* HEADER */
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ZEWELRA", 20, 18);

    doc.setFontSize(10);
    doc.text("Premium Jewelry Store", 140, 18);

    doc.setTextColor(0, 0, 0);

    /* TITLE */
    doc.setFontSize(16);
    doc.text("INVOICE", 20, 45);

    /* ORDER INFO */
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${order.id}`, 20, 55);
    doc.text(
      `Date: ${
        order.createdAt?.toDate
          ? order.createdAt.toDate().toLocaleDateString()
          : ""
      }`,
      20,
      63
    );

    /* CUSTOMER */
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 80);

    doc.setFont("helvetica", "normal");
    doc.text(order.customer?.name || "", 20, 90);
    doc.text(order.customer?.email || "", 20, 98);
    doc.text(order.customer?.phone || "", 20, 106);

    const addressLines = doc.splitTextToSize(
      order.customer?.address || "",
      160
    );
    doc.text(addressLines, 20, 114);

    /* TABLE */
    let y = 140;

    doc.setFillColor(230, 230, 230);
    doc.rect(20, y, 170, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Item", 25, y + 7);
    doc.text("Qty", 120, y + 7);
    doc.text("Price", 150, y + 7);

    y += 20;

    doc.setFont("helvetica", "normal");

    order.items.forEach((item) => {
      const nameLines = doc.splitTextToSize(item.name, 80);

      doc.text(nameLines, 25, y);
      doc.text(String(item.qty), 125, y);
      doc.text(`Rs. ${item.price * item.qty}`, 150, y);

      y += nameLines.length * 8;
    });

    /* TOTAL */
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: Rs. ${order.total}`, 140, y);

    /* PAYMENT INFO */
    y += 15;
    doc.setFont("helvetica", "normal");

    doc.text(`Payment Method: ${order.paymentMethod}`, 20, y);
    doc.text(
      `Payment Status: ${
        order.paymentStatus === "Paid" ? "Paid" : "Pending"
      }`,
      20,
      y + 8
    );

    // 🔥 RAZORPAY DETAILS
    if (order.razorpayPaymentId) {
      doc.text(
        `Payment ID: ${order.razorpayPaymentId}`,
        20,
        y + 16
      );
    }

    if (order.razorpayOrderId) {
      doc.text(
        `Order Ref: ${order.razorpayOrderId}`,
        20,
        y + 24
      );
    }

    /* FOOTER */
    doc.setTextColor(120);
    doc.setFontSize(10);
    doc.text("Thank you for shopping with ZEWELRA", 20, 285);

    doc.save(`invoice_${order.id}.pdf`);
  };

  /* ================= FILTER ================= */
  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      filter === "All" || order.status === filter;

    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  /* ================= STYLE ================= */
  const statusStyle = (status) => {
    const map = {
      Delivered: "bg-green-100 text-green-600",
      Shipped: "bg-blue-100 text-blue-600",
      Confirmed: "bg-purple-100 text-purple-600",
      Processing: "bg-yellow-100 text-yellow-600",
      Cancelled: "bg-red-100 text-red-600"
    };
    return map[status] || "bg-gray-200 text-gray-600";
  };

  const paymentStyle = (status) => {
    const map = {
      Paid: "bg-green-100 text-green-600",
      Pending: "bg-yellow-100 text-yellow-600",
      Failed: "bg-red-100 text-red-600"
    };
    return map[status] || "bg-gray-200 text-gray-600";
  };

  /* ================= TIMELINE ================= */
  const getTimeline = (status) => {
    const steps = ["Processing", "Confirmed", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(status);

    return steps.map((step, index) => ({
      step,
      done: index <= currentIndex
    }));
  };

  /* ================= REORDER ================= */
  const handleReorder = (items) => {
    items.forEach((item) => addToCart(item));
    alert("Items added to cart 🛒");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EF]">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      {/* HEADER */}
      <div className="flex justify-between mb-10 flex-wrap gap-4">
        <h1 className="text-4xl font-serif">
          My <span className="text-[#e7b6a1]">Orders</span>
        </h1>

        <input
          type="text"
          placeholder="Search order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-full border"
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Processing", "Confirmed", "Shipped", "Delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full ${
              filter === f ? "bg-black text-white" : "bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      {filteredOrders.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded-2xl mb-6 shadow">

          {/* HEADER */}
          <div className="flex justify-between mb-4">
            <div>
              <p>#{order.id.slice(0, 6)}</p>
              <p className="text-xs text-gray-400">
                {order.createdAt?.toDate()?.toLocaleString()}
              </p>

              {/* 🔥 Razorpay ID */}
              {order.razorpayPaymentId && (
                <p className="text-xs text-gray-400">
                  Payment ID: {order.razorpayPaymentId.slice(0, 10)}...
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <span className={`px-2 py-1 text-xs ${statusStyle(order.status)}`}>
                {order.status}
              </span>
              <span className={`px-2 py-1 text-xs ${paymentStyle(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="flex gap-2 mb-4">
            {getTimeline(order.status).map((t, i) => (
              <div key={i} className="flex-1 text-center text-xs">
                <div className={`h-2 ${t.done ? "bg-[#e7b6a1]" : "bg-gray-200"}`} />
                {t.step}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between mt-4">
            <p>₹{order.total}</p>

            <div className="flex gap-3">
              <button onClick={() => handleReorder(order.items)}>
                Reorder
              </button>

              <button onClick={() => downloadInvoice(order)}>
                Invoice
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Orders;