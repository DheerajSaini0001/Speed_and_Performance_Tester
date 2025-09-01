import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAllData(null);

    try {
      const response = await fetch("http://localhost:2000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: url }),
      });

      const result = await response.json();

      const newData = {
        url: result.desktop?.lighthouseResult?.finalUrl || url,

        // Desktop
        totalTiming: result.desktop?.lighthouseResult?.timing?.total || "N/A",
        performance:
          (result.desktop?.lighthouseResult?.categories?.performance?.score ??
            0) * 100 || "N/A",
        fcp:
          result.desktop?.lighthouseResult?.audits?.[
            "first-contentful-paint"
          ]?.displayValue || "N/A",
        lcp:
          result.desktop?.lighthouseResult?.audits?.[
            "largest-contentful-paint"
          ]?.displayValue || "N/A",
        cls:
          result.desktop?.lighthouseResult?.audits?.[
            "cumulative-layout-shift"
          ]?.displayValue || "N/A",
        tbt:
          result.desktop?.lighthouseResult?.audits?.[
            "total-blocking-time"
          ]?.displayValue || "N/A",

        // Mobile
        totalTimingMobile:
          result.mobile?.lighthouseResult?.timing?.total || "N/A",
        performanceMobile:
          (result.mobile?.lighthouseResult?.categories?.performance?.score ??
            0) * 100 || "N/A",
        fcpMobile:
          result.mobile?.lighthouseResult?.audits?.[
            "first-contentful-paint"
          ]?.displayValue || "N/A",
        lcpMobile:
          result.mobile?.lighthouseResult?.audits?.[
            "largest-contentful-paint"
          ]?.displayValue || "N/A",
        clsMobile:
          result.mobile?.lighthouseResult?.audits?.[
            "cumulative-layout-shift"
          ]?.displayValue || "N/A",
        tbtMobile:
          result.mobile?.lighthouseResult?.audits?.[
            "total-blocking-time"
          ]?.displayValue || "N/A",
      };

      setAllData(newData);
      setUrl(""); // clear input
    } catch (error) {
      alert("Data is not posted: " + error);
    } finally {
      setLoading(false);
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

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
          ⏳ Analyzing website... Please wait
        </div>
      )}

      {/* Results Section */}
      {allData && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">✅ Results</h2>

          {/* Desktop */}
          <div className="grid gap-4">
            <h2>For Desktop:</h2>
            <div className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition">
              <div>
                <p className="font-medium text-lg text-gray-800">
                  🌍 {allData.url}
                </p>
                <p className="text-sm text-gray-500">
                  Timing: {allData.totalTiming} ms
                </p>
              </div>
              <span
                className={`mt-3 md:mt-0 px-4 py-2 rounded-lg text-white font-bold ${
                  allData.performance >= 80
                    ? "bg-green-500"
                    : allData.performance >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {allData.performance}%
              </span>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-semibold text-gray-700">FCP</p>
                <p className="text-gray-600">{allData.fcp}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">LCP</p>
                <p className="text-gray-600">{allData.lcp}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">CLS</p>
                <p className="text-gray-600">{allData.cls}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">TBT</p>
                <p className="text-gray-600">{allData.tbt}</p>
              </div>
            </div>
          </div>

          <br />
          <hr />
          <br />

          {/* Mobile */}
          <div className="grid gap-4">
            <h2>For Mobile:</h2>
            <div className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition">
              <div>
                <p className="font-medium text-lg text-gray-800">
                  🌍 {allData.url}
                </p>
                <p className="text-sm text-gray-500">
                  Timing: {allData.totalTimingMobile} ms
                </p>
              </div>
              <span
                className={`mt-3 md:mt-0 px-4 py-2 rounded-lg text-white font-bold ${
                  allData.performanceMobile >= 80
                    ? "bg-green-500"
                    : allData.performanceMobile >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {allData.performanceMobile}%
              </span>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-semibold text-gray-700">FCP</p>
                <p className="text-gray-600">{allData.fcpMobile}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">LCP</p>
                <p className="text-gray-600">{allData.lcpMobile}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">CLS</p>
                <p className="text-gray-600">{allData.clsMobile}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">TBT</p>
                <p className="text-gray-600">{allData.tbtMobile}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
