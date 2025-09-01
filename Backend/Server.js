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

app.post('/data', async (req, res) => {
  const { message } = req.body;
  console.log(`URL Received: ${message}`);

  try {
    const apiUrlDesktop =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=desktop&key=${API_KEY}`;
    const apiUrlMobile =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=mobile&key=${API_KEY}`;

    const responseDesktop = await fetch(apiUrlDesktop);
    const responseMobile = await fetch(apiUrlMobile);
    console.log(apiUrlDesktop);
    

    
    const dataDasktop = await responseDesktop.json();    
    const dataMobile = await responseMobile.json();    
    const alldata={desktop:dataDasktop,mobile:dataMobile}
    res.json(alldata);
    console.log(alldata);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});



app.listen(PORT,()=>{ console.log(`http://localhost:2000`);
})