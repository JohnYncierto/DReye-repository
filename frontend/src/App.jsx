import { useState, useEffect } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import UploadBox from './components/UploadBox'  
import Results from './components/Results'
import Login from './components/Login'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState("")
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if(!loggedIn) return;
    fetch(`${API_URL}/api/results`)
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(err => console.error('Failed to load results:', err));
  }, [loggedIn]);

  const handleNewResult = (data) => {
    setResults((prev) => [{ ...data, id: Date.now() }, ...prev]);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setResults([]);
    setSearch('');
  };

  const filteredResults = results.filter((r) => 
  (r.patient_name || r.patientName || '').toLowerCase().includes(search.toLowerCase())
  );

  if(!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
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
              <Results key={r.screening_id} results={r} />
            ))
          )
          }
        </div>
      </div>
    </div>
  )
  

}

export default App
