import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [allData, setAllData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/data/inputtext", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: url }),
      });

      const result = await response.json();

      const newData = {
        url: result.lighthouseResult.finalUrl,
        totalTiming: result.lighthouseResult.timing.total,
        performance: result.scores.performance*100,
      };

      setAllData((prev) => [...prev, newData]);
      setUrl(""); // clear input
    } catch (error) {
      alert("Data is not posted: " + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🚀 Website Performance Checker
      </h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg flex flex-col items-center"
      >
        <input
          type="url"
          placeholder="Enter your website URL..."
          value={url}
          className="border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-300 rounded-xl px-4 py-2 w-full mb-4 outline-none"
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-amber-500 text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:bg-amber-600 transition"
        >
          Check Performance
        </button>
      </form>

      {/* Results Section */}
      {allData.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            ✅ Results
          </h2>
          <div className="grid gap-4">
            {allData.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition"
              >
                <div>
                  <p className="font-medium text-lg text-gray-800">
                    🌍 {item.url}
                  </p>
                  <p className="text-sm text-gray-500">
                    Timing: {item.totalTiming} ms
                  </p>
                </div>
                <span
                  className={`mt-3 md:mt-0 px-4 py-2 rounded-lg text-white font-bold ${
                    item.performance >= 80
                      ? "bg-green-500"
                      : item.performance >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {item.performance}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
