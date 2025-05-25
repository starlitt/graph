import React, { useState } from 'react'
import WeeklyGraph from './components/WeeklyGraph'

function App() {
  const [graphs, setGraphs] = useState([{ id: 1, title: 'Weekly Productivity' }]);
  
  const handleAddGraph = () => {
    const newId = Math.max(0, ...graphs.map(g => g.id)) + 1;
    setGraphs([...graphs, { id: newId, title: `Weekly Productivity ${newId}` }]);
  };
  
  const handleRemoveGraph = (id) => {
    setGraphs(graphs.filter(graph => graph.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Production Graphs</h1>
        <button 
          onClick={handleAddGraph}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Graph
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {graphs.map(graph => (
          <WeeklyGraph 
            key={graph.id} 
            initialTitle={graph.title} 
            isOriginal={graph.id === 1}
            onDelete={() => handleRemoveGraph(graph.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
