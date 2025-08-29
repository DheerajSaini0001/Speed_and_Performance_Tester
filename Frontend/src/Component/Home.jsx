import React, { useState } from 'react'

export default function Home() {
    const [data,setData]=useState({
        url:'',
        performance:'',
        lightHouseVersion:''
    })
    const [allData,setAllData]=useState([]);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const response= await fetch('http://localhost:2000/data/inputtext',{
                method:"Post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({message: url} ),
            })
            const result = await response.json();
        
            console.log(result)
             alert(result.lighthouseResult.timing.total);
           const newData={
                url: result.lighthouseResult.finalUrl,
                totalTiming: result.lighthouseResult.timing.total,
                performance: result.scores.performance
              };
             
              setAllData([...allData,data])
             
              console.log(allData);
              
            }
        catch(error){
            alert('Data is not posted',error)
        }
        console.log(url)
    }


    const [url,setUrl]=useState({
        sucess:true,
        url:''
    });

  return (
    <>
    <div>
        <form action="" onSubmit={handleSubmit}>
        <input type="url" name='url' onChange={(e)=>setUrl(e.target.value)} required  />
        <button type='submit'>Send</button>
        </form>
    </div>

    {allData.length>0&&
    allData.map((item,index)=>(
        <p><pre> URL = {item.url}     Performance = {item.performance}      Timimg = {item.totalTiming}</pre></p>
    ))}
    </>
  )
}
