import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Navbar from './components/Navbar'
import UploadBox from './components/UploadBox'  
import Results from './components/Results'

function App() {
  const [count, setCount] = useState([])
  const [search, setSearch] = useState("")

  const handleNewResult = (data) => {
    const newResult = {
      id: Date.now(),
      patientName: data.patientName,
      doctorName: data.doctorName,
      category: data.category,
      
    }
  }
}

export default App
