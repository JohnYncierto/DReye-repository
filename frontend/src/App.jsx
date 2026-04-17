import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import UploadBox from './components/UploadBox'  
import Results from './components/Results'

function App() {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState("")

  const handleNewResult = (data) => {
    const newResult = {
      id: Date.now(),
      patientName: data.patientName,
      doctorName: data.doctorName,
      category: data.category,
      notes: data.notes,
      prediction: "Processing", // Placeholder, replace with actual prediction
      confidence: 0.85, // Placeholder, replace with actual confidence
      image: data.file ? URL.createObjectURL(data.file) : "", // Create a URL for the uploaded image
    };

    setResults((prev) => [newResult, ...prev]);

    //Fave AI Processing (placeholder)
    setTimeout(() => {
      setResults((prev) =>
        prev.map((r) =>
          r.id === newResult.id
            ? { 
              ...r, 
              prediction: "No DR (placeholder)", 
              confidence: 0.92
             } // Update with actual prediction and confidence
            : r
        )
      );
    }, 2000);
  };

  const filteredResults = results.filter((r) => 
    r.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <UploadBox onSubmit={handleNewResult} />

        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 mt-6 border rounded-lg"
          />
        </div>

        {/* Results List */}
        <h2 className="text-2xl font-bold mt-6 mb-4"> Screening Results</h2>

        <div className="grid md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
          {filteredResults.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : (
            filteredResults.map((r) => (
              <Results key={r.id} results={r} />
            ))
          )
          }
        </div>
      </div>
    </div>
  )
  

}

export default App
