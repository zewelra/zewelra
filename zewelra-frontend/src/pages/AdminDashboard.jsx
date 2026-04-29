import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaUsers,
  FaRupeeSign,
  FaShoppingBag,
  FaPlus,
  FaSync
} from "react-icons/fa";

// 🔥 FIREBASE
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc
} from "firebase/firestore";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    users: 0,
    products: 0
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(data);

      const totalOrders = data.length;
      const revenue = data.reduce((acc, o) => acc + (o.total || 0), 0);

      const userSnap = await getDocs(collection(db, "users"));

      setStats({
        totalOrders,
        revenue,
        users: userSnap.size,
        products: 0
      });

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE ================= */
  const updateOrder = async (id, field, value) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        [field]: value
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STYLES ================= */
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EF]">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F2EF] min-h-screen flex">

      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-serif mb-10">Admin Panel</h2>

        <div className="flex flex-col gap-4 text-sm">
          <button className="text-left font-medium text-[#e7b6a1]">
            Dashboard
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-10 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif">Dashboard</h1>

          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <FaSync /> Refresh
            </button>

            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white hover:scale-105 transition">
              <FaPlus /> Add Product
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card title="Orders" value={stats.totalOrders} icon={<FaShoppingBag />} />
          <Card title="Revenue" value={`₹${stats.revenue}`} icon={<FaRupeeSign />} />
          <Card title="Users" value={stats.users} icon={<FaUsers />} />
          <Card title="Products" value={stats.products} icon={<FaBoxOpen />} />
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-6">
            Manage Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="text-gray-400 border-b">
                  <tr>
                    <th className="py-3">ID</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-[#f6f2ef]">

                      <td className="py-3">{o.id.slice(0, 6)}</td>
                      <td>{o.customer?.name || "User"}</td>
                      <td>₹{o.total}</td>

                      {/* STATUS DROPDOWN */}
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            updateOrder(o.id, "status", e.target.value)
                          }
                          className={`px-2 py-1 rounded text-xs ${statusStyle(o.status)}`}
                        >
                          <option>Processing</option>
                          <option>Confirmed</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>

                      {/* PAYMENT DROPDOWN */}
                      <td>
                        <select
                          value={o.paymentStatus || "Pending"}
                          onChange={(e) =>
                            updateOrder(o.id, "paymentStatus", e.target.value)
                          }
                          className={`px-2 py-1 rounded text-xs ${paymentStyle(o.paymentStatus)}`}
                        >
                          <option>Pending</option>
                          <option>Paid</option>
                          <option>Failed</option>
                        </select>
                      </td>

                      {/* DATE */}
                      <td className="text-gray-400 text-xs">
                        {o.createdAt?.toDate
                          ? o.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

/* CARD */
const Card = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
    <div className="flex justify-between mb-2">
      <p className="text-gray-400">{title}</p>
      <span className="text-[#e7b6a1]">{icon}</span>
    </div>
    <h2 className="text-2xl font-semibold">{value}</h2>
  </div>
);

export default AdminDashboard;