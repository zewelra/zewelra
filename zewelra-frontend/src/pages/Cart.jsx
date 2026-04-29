import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-[#F6F2EF] min-h-screen px-6 md:px-16 py-12">

      <h2 className="text-4xl font-serif mb-10">
        Your <span className="text-[#e7b6a1]">Cart</span>
      </h2>

      {/* ================= EMPTY ================= */}
      {cart.length === 0 ? (
        <div className="text-center mt-24">
          <p className="text-gray-500 text-lg mb-6">
            Your cart is empty
          </p>

          <Link to="/products">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition">
              Shop Now →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">

          {/* ================= ITEMS ================= */}
          <div className="md:col-span-2 space-y-6">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between 
                bg-white/80 backdrop-blur p-5 rounded-2xl 
                shadow-sm hover:shadow-lg transition gap-4"
              >

                {/* LEFT */}
                <div className="flex items-center gap-5">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-[#e7b6a1] font-medium">
                      ₹{item.price}
                    </p>

                    {/* ITEM TOTAL */}
                    <p className="text-xs text-gray-400 mt-1">
                      Subtotal: ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>

                {/* QTY */}
                <div className="flex items-center gap-3">

                  <div className="flex items-center gap-2 border rounded-full px-3 py-1">

                    <button
                      disabled={item.qty === 1}
                      onClick={() =>
                        updateQty(item.id, item.qty - 1)
                      }
                      className={`px-2 text-lg ${
                        item.qty === 1 && "opacity-30 cursor-not-allowed"
                      }`}
                    >
                      −
                    </button>

                    <span className="px-2">{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item.id, item.qty + 1)
                      }
                      className="px-2 text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

            {/* CLEAR CART */}
            <div className="text-right">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Clear Cart
              </button>
            </div>

          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow h-fit sticky top-24">

            <h3 className="text-2xl font-serif mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 text-gray-600">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

            </div>

            {/* CHECKOUT */}
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full py-3 rounded-full 
              bg-gradient-to-r from-black to-gray-800 
              text-white hover:scale-105 hover:shadow-lg 
              transition"
            >
              Proceed to Checkout →
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;