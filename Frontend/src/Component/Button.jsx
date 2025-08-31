import React from "react";
import { Link } from "react-router-dom";

export default function Button() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center w-[400px] text-center">
        
        <h3 className="text-2xl font-bold text-indigo-600 mb-6">
          🚀 Website Performance Checker
        </h3>
        <p className="text-gray-600 mb-8">
          Upload a file of URLs or enter them manually to check performance.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Link to="/file">
            <button className="w-full bg-indigo-500 text-white py-3 rounded-xl shadow-md hover:bg-indigo-600 transition">
              📂 Upload File
            </button>
          </Link>

          <Link to="/home">
            <button className="w-full bg-pink-500 text-white py-3 rounded-xl shadow-md hover:bg-pink-600 transition">
              ✍️ Enter Manually
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
