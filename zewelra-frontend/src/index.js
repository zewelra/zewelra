import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./index.css";

// ✅ ROOT
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// ✅ RENDER APP
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);