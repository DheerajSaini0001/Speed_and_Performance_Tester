const express=require('express')
const app=express()
const cors=require('cors')
const PORT=2000
app.use(express.json())
app.use(cors())
const fetch = require("node-fetch");

const API_KEY = 'AIzaSyCww7MhvCEUmHhlACNBqfbzL5PUraT8lkk';

app.get('/',(req,res)=>{
    res.send("Welcome to the Backend Server")
})

app.post('/data/inputtext', async (req, res) => {
  const { message } = req.body;
  console.log(`URL Received: ${message}`);

  try {
    const apiUrl =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=mobile&key=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    const categories = data?.lighthouseResult?.categories || {};
    const performanceScore = categories.performance?.score ?? null;
    const accessibilityScore = categories.accessibility?.score ?? null;
    const bestPracticesScore = categories["best-practices"]?.score ?? null;
    const seoScore = categories.seo?.score ?? null;
    const pwaScore = categories.pwa?.score ?? null;

    res.json({
      success: true,
      url: message,
      scores: {
        performance: performanceScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore,
        seo: seoScore,
        pwa: pwaScore,
      },
      lighthouseResult: data?.lighthouseResult || null,
    });
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});

app.post('/data', async (req, res) => {
  const { message } = req.body;
  console.log(`URL Received: ${message}`);

  try {
    const apiUrl =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=mobile&key=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    const categories = data?.lighthouseResult?.categories || {};
    const performanceScore = categories.performance?.score ?? null;
    const accessibilityScore = categories.accessibility?.score ?? null;
    const bestPracticesScore = categories["best-practices"]?.score ?? null;
    const seoScore = categories.seo?.score ?? null;
    const pwaScore = categories.pwa?.score ?? null;

    res.json({
      success: true,
      url: message,
      scores: {
        performance: performanceScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore,
        seo: seoScore,
        pwa: pwaScore,
      },
      lighthouseResult: data?.lighthouseResult || null,
    });
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});



app.listen(PORT,()=>{ console.log(`http://localhost:2000`);
})