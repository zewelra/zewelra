import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-soft">
      
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>

      <Link to="/">
        <button className="bg-accent text-white px-6 py-2 rounded">
          Go Home
        </button>
      </Link>

    </div>
  );
};

export default NotFound;