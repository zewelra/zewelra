import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();

  /* ================= SAFE STORAGE ================= */
  const getStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Storage error:", err);
      return [];
    }
  };

  /* ================= STATE ================= */
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (currentUser) {
      setCart(getStorage(`cart_${currentUser.uid}`));
      setWishlist(getStorage(`wishlist_${currentUser.uid}`));
    } else {
      setCart(getStorage("cart_guest"));
      setWishlist(getStorage("wishlist_guest"));
    }
  }, [currentUser]);

  /* ================= SAVE ================= */
  useEffect(() => {
    const key = currentUser ? `cart_${currentUser.uid}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, currentUser]);

  useEffect(() => {
    const key = currentUser ? `wishlist_${currentUser.uid}` : "wishlist_guest";
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, currentUser]);

  /* ================= NORMALIZE PRODUCT ================= */
  const normalizeProduct = (product) => {
    return {
      id: product.id,
      name: product.name || "Product",
      price: Number(product.price) || 0,
      image: product.image || "",
      qty: product.qty || 1
    };
  };

  /* ================= CART ================= */

  const addToCart = (product) => {
    if (!product || !product.id) return;

    const safeProduct = normalizeProduct(product);

    setCart((prev) => {
      const exists = prev.find((item) => item.id === safeProduct.id);

      if (exists) {
        return prev.map((item) =>
          item.id === safeProduct.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, safeProduct];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty - 1) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartItem = (id) => {
    return cart.find((item) => item.id === id);
  };

  /* ================= WISHLIST ================= */

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    const safeProduct = normalizeProduct(product);

    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === safeProduct.id);

      if (exists) {
        return prev.filter((item) => item.id !== safeProduct.id);
      }

      return [...prev, safeProduct];
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => setWishlist([]);

  /* ================= DERIVED ================= */

  const totalPrice = Math.round(
    cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const totalUniqueItems = cart.length;

  /* ================= MULTI TAB SYNC ================= */

  useEffect(() => {
    const sync = (e) => {
      if (!currentUser) return;

      if (e.key === `cart_${currentUser.uid}`) {
        setCart(e.newValue ? JSON.parse(e.newValue) : []);
      }

      if (e.key === `wishlist_${currentUser.uid}`) {
        setWishlist(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [currentUser]);

  /* ================= PROVIDER ================= */

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,

        addToCart,
        removeFromCart,
        updateQty,
        increaseQty,
        decreaseQty,
        clearCart,
        getCartItem,

        toggleWishlist,
        isInWishlist,
        clearWishlist,

        totalPrice,
        totalItems,
        totalUniqueItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};