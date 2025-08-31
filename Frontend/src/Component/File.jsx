import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function File() {
  const [rows, setRows] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    console.log("Updated allData:", allData);
  }, [allData]);

  const handleSubmitFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const urls = text.split(/\r?\n/).filter(Boolean);

        for (const url of urls) {
          try {
            const response = await fetch("http://localhost:2000/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: url }),
            });

            const result = await response.json();

            const newData = {
              url: result?.lighthouseResult?.finalUrl || url,
              performance: result?.lighthouseResult?.categories?.performance?.score
                ? result.lighthouseResult.categories.performance.score * 100
                : "N/A",
              totalTiming: result?.lighthouseResult?.timing?.total || "N/A",
            };

            setAllData((prev) => [...prev, newData]);
          } catch (error) {
            console.error("Error posting data:", error);
          }
        }
      };
      reader.readAsText(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          setRows(results.data);
          for (const row of results.data) {
            try {
              const response = await fetch("http://localhost:2000/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: row.URL }),
              });

              const result = await response.json();

              const newData = {
                url: result?.lighthouseResult?.finalUrl || row.URL,
                performance: result?.lighthouseResult?.categories?.performance?.score
                  ? result.lighthouseResult.categories.performance.score * 100
                  : "N/A",
                totalTiming: result?.lighthouseResult?.timing?.total || "N/A",
              };

              setAllData((prev) => [...prev, newData]);
            } catch (error) {
              console.error("Error posting data:", error);
            }
          }
        },
      });
    }
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
        {!allData.length && (
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

        {allData.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-indigo-600 mb-4 text-center">
              ✅ Performance Results
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="py-2 px-4 border">URL</th>
                    <th className="py-2 px-4 border">Performance</th>
                    <th className="py-2 px-4 border">Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border text-blue-600">{item.url}</td>
                      <td className="py-2 px-4 border text-center">{item.performance}</td>
                      <td className="py-2 px-4 border text-center">{item.totalTiming}</td>
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
