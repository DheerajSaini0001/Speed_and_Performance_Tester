import React, { useState,useEffect } from "react";
import Papa from "papaparse";

export default function File() {
  const [rows, setRows] = useState([]);
  
  const [allData,setAllData]=useState([])
  useEffect(() => {
    console.log("Updated allData:", allData);
  }, [allData]);


  const handleSubmitFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,   // first row = column headers
      skipEmptyLines: true,
      complete: async (results) => {
        console.log("Parsed CSV:", results.data);   //Convert the CSV into a object form
        setRows(results.data); // store in state

        // Loop through each row and send to backend
        for (const row of results.data) {
          try {
            const response = await fetch("http://localhost:2000/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: row.URL }), // send URL to backend
            });

            const result = await response.json();
            // console.log("Backend Response:", result);

            // Example: extract some fields from API response
            const newData = {
              url: result.url,
              performance: result.scores.performance,
              totalTiming: result.lighthouseResult.timing.total,
            };
              
            setAllData((prev) => [...prev, newData]);
            console.log(allData);
            
            console.log("Formatted Data:", newData);
          } catch (error) {
            console.error("Error posting data:", error);
          }
        }
      },
    });
  };



  const handleDownloadCSV = () => {
    const csv = Papa.unparse(allData); // convert array of objects → CSV string
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
    <>
      <div>
        <input type="file" accept=".csv" onChange={handleSubmitFile} />

       
        { allData.length>0 &&    allData.map((item, i) => (
          <p key={i}>
          <pre> URL = {item.url}     Performance = {item.performance}    Timing = {item.totalTiming}</pre>
          </p>
        ))}

        {allData.length>0&& <button onClick={handleDownloadCSV}>Download CSV</button>}
      </div>
    </>
  );
}
