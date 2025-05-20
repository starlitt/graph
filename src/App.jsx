import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function App() {
  const [graphs, setGraphs] = useState([{
    id: 1,
    startDate: '2023-12-01',
    weeklyValues: {},
    graphTitle: 'Production per Week',
    yAxisMin: 0,
    yAxisMax: 100,
    yAxisMinInput: '0',
    yAxisMaxInput: '100',
    selectedWeek: '',
    count: ''
  }]);

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '100%'
  };

  const containerStyle = {
    padding: '20px', // Increased padding
    paddingTop: '50px', // Added top padding for delete button
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const chartContainerStyle = {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const axisControlsStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '10px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#495057'
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#228be6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px'
  };

  const deleteButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#fa5252',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    position: 'absolute',
    right: '20px',
    top: '20px'
  };

  const editableTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#495057',
    border: '1px solid transparent',
    padding: '4px 8px',
    marginBottom: '10px',
    borderRadius: '4px',
    width: 'auto',
    background: 'transparent'
  };

  const editableTitleHoverStyle = {
    ...editableTitleStyle,
    backgroundColor: '#f8f9fa',
    cursor: 'pointer'
  };

  const addNewGraph = () => {
    const newId = Math.max(...graphs.map(g => g.id)) + 1;
    setGraphs([...graphs, {
      id: newId,
      startDate: '2023-12-01',
      weeklyValues: {},
      graphTitle: `Production per Week ${newId}`,
      yAxisMin: 0,
      yAxisMax: 100,
      yAxisMinInput: '0',
      yAxisMaxInput: '100',
      selectedWeek: '',
      count: ''
    }]);
  };

  const deleteGraph = (id) => {
    setGraphs(graphs.filter(graph => graph.id !== id));
  };

  const updateGraph = (id, field, value) => {
    setGraphs(graphs.map(graph => {
      if (graph.id === id) {
        return { ...graph, [field]: value };
      }
      return graph;
    }));
  };

  const generateWeekOptions = (startDate) => {
    const options = [];
    let currentDate = new Date(startDate);
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 2);
    let weekNumber = 1;

    while (currentDate < endDate && weekNumber <= 9) {
      const weekKey = `${currentDate.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
      options.push(
        <option key={weekKey} value={weekKey}>
          Week {weekNumber} ({currentDate.toLocaleDateString()})
        </option>
      );
      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }

    return options;
  };

  const generateWeeklyData = (startDate, weeklyValues) => {
    const data = [];
    let currentDate = new Date(startDate);
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 2);
    let weekNumber = 1;

    while (currentDate < endDate && weekNumber <= 9) {
      const weekKey = `${currentDate.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
      data.push({
        week: `Week ${weekNumber}`,
        value: weeklyValues[weekKey] || 0
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }

    return data;
  };

  const handleCountChange = (graphId, value, selectedWeek) => {
    setGraphs(graphs.map(graph => {
      if (graph.id === graphId && selectedWeek) {
        return {
          ...graph,
          count: value,
          weeklyValues: {
            ...graph.weeklyValues,
            [selectedWeek]: Number(value)
          }
        };
      }
      return graph;
    }));
  };

  return (
    <div style={{ backgroundColor: '#f1f3f5', minHeight: '100vh', padding: '20px' }}>
      <button onClick={addNewGraph} style={buttonStyle}>
        Add New Production Graph
      </button>

      <div style={gridContainerStyle}>
        {graphs.map(graph => (
          <div key={graph.id} style={{ ...containerStyle, position: 'relative' }}>
            {graph.id !== 1 && (
              <button 
                onClick={() => deleteGraph(graph.id)} 
                style={deleteButtonStyle}
              >
                Delete
              </button>
            )}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Start Date:</label>
              <input
                type="date"
                value={graph.startDate}
                onChange={(e) => updateGraph(graph.id, 'startDate', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Select Week:</label>
              <select 
                value={graph.selectedWeek}
                onChange={(e) => updateGraph(graph.id, 'selectedWeek', e.target.value)}
                style={inputStyle}
              >
                <option value="">Select a week</option>
                {generateWeekOptions(graph.startDate)}
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Production Count:</label>
              <input
                type="number"
                value={graph.count}
                onChange={(e) => handleCountChange(graph.id, e.target.value, graph.selectedWeek)}
                style={inputStyle}
                placeholder="Enter production count"
              />
            </div>

            <div style={chartContainerStyle}>
              <div style={axisControlsStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Lowest Point</label>
                  <input
                    type="number"
                    value={graph.yAxisMinInput}
                    onChange={(e) => updateGraph(graph.id, 'yAxisMinInput', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Highest Point</label>
                  <input
                    type="number"
                    value={graph.yAxisMaxInput}
                    onChange={(e) => updateGraph(graph.id, 'yAxisMaxInput', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <LineChart 
                width={600}
                height={350}
                data={generateWeeklyData(graph.startDate, graph.weeklyValues)}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis 
                  dataKey="week" 
                  stroke="#495057"
                  tick={{ fill: '#495057', fontSize: 12 }}
                  tickLine={{ stroke: '#495057' }}
                />
                <YAxis 
                  domain={[Number(graph.yAxisMinInput), Number(graph.yAxisMaxInput)]}
                  stroke="#495057"
                  tick={{ fill: '#495057' }}
                  tickLine={{ stroke: '#495057' }}
                  allowDataOverflow={true}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#228be6" 
                  strokeWidth={2}
                  dot={{ fill: '#228be6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#228be6', stroke: '#ffffff', strokeWidth: 2 }}
                  name="Production"
                />
              </LineChart>
              <input
                type="text"
                value={graph.graphTitle}
                onChange={(e) => updateGraph(graph.id, 'graphTitle', e.target.value)}
                style={editableTitleStyle}
                onFocus={(e) => e.target.style.border = '1px dashed #adb5bd'}
                onBlur={(e) => e.target.style.border = '1px solid transparent'}
                onMouseEnter={(e) => Object.assign(e.target.style, editableTitleHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, editableTitleStyle)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
