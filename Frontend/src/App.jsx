import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Component/Home'
import File from './Component/File'
// import {BrowserRoutes as Router, Routes ,Route} from 'react-router-dom'
import {Routes, Route } from "react-router-dom";
import Button from './Component/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>


    <Routes>
      
      <Route path='/' element={<Button/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/file' element={<File/>} />
    </Routes>

    {/* <File/> */}
    {/* <Home/> */}
      </>
  )
}

export default App
