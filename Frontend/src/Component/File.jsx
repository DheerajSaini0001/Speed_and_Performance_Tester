import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function File() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Updated allData:", allData);
  }, [allData]);

  const handleSubmitFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true); // start loading
    setAllData([]);   // reset old data

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split(/\r?\n/).filter(Boolean); // clean empty lines

      const results = [];

      for (const url of rows) {
        try {
          const res = await fetch("http://localhost:2000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: url.trim() }),
          });
          const result = await res.json();

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
          console.log(newData);
          
          results.push(newData);
        } catch (err) {
          console.error("Error fetching PageSpeed for", url, err);
          results.push({
            url,
            performance: "Error",
            totalTiming: "Error",
            status: "❌ Failed",
          });
        }
      }

      setAllData(results);
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handleDownloadTXT = () => {
    let txt = "URL | Performance | Timing\n";
    txt += allData
      .map((item) => `${item.url} | ${item.performance} | ${item.totalTiming}`)
      .join("\n");

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "results.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        
        {loading && (
          <div className="text-center">
            <p className="text-indigo-600 font-semibold text-lg animate-pulse">
              ⏳ Fetching performance data for all URLs, please wait...
            </p>
          </div>
        )}

        {!loading && !allData.length && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-600 mb-6">
              🚀 Website Performance Checker
            </h3>
            <p className="text-gray-600 mb-4">
              Upload a <b>.txt</b> (one URL per line) or <b>.csv</b> file to check performance.
            </p>
            <label className="cursor-pointer bg-indigo-500 text-white py-3 px-6 rounded-xl shadow-md hover:bg-indigo-600 transition">
              📂 Choose File
              <input
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={handleSubmitFile}
              />
            </label>
          </div>
        )}

        {!loading && allData.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-indigo-600 mb-4 text-center">
              ✅ Performance Results
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="py-2 px-4 border">URL</th>
                    <th className="py-2 px-4 border">Desktop Score</th>
                    <th className="py-2 px-4 border">Timing</th>
                    <th className="py-2 px-4 border">FCP</th>
                    <th className="py-2 px-4 border">LCP</th>
                    <th className="py-2 px-4 border">CLS</th>
                    <th className="py-2 px-4 border">Mobile Score</th>
                    <th className="py-2 px-4 border">Mobile Timing</th>
                    <th className="py-2 px-4 border">Mobile FCP</th>
                    <th className="py-2 px-4 border">Mobile LCP</th>
                    <th className="py-2 px-4 border">Mobile CLS</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border text-blue-600">{item.url}</td>
                      <td className="py-2 px-4 border text-center">{item.performance.toFixed(1)} %</td>
                      <td className="py-2 px-4 border text-center">{item.totalTiming.toFixed(1)}</td>
                      <td className="py-2 px-4 border text-center">{item.fcp}</td>
                      <td className="py-2 px-4 border text-center">{item.lcp}</td>
                      <td className="py-2 px-4 border text-center">{item.cls}</td>
                      <td className="py-2 px-4 border text-center">{item.performanceMobile.toFixed(1)}%</td>
                      <td className="py-2 px-4 border text-center">{item.totalTimingMobile.toFixed(1)}</td>
                      <td className="py-2 px-4 border text-center">{item.fcpMobile}</td>
                      <td className="py-2 px-4 border text-center">{item.lcpMobile}</td>
                      <td className="py-2 px-4 border text-center">{item.clsMobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                className="bg-indigo-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-indigo-600 transition"
                onClick={handleDownloadCSV}
              >
                ⬇️ Download CSV
              </button>
              <button
                className="bg-pink-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-pink-600 transition"
                onClick={handleDownloadTXT}
              >
                ⬇️ Download TXT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
