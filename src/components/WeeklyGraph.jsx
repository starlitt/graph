import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklyGraph({ initialTitle = 'Weekly Productivity', isOriginal = false, onDelete }) {
  const [startDate, setStartDate] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeklyValues, setWeeklyValues] = useState([832820]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1000000);
  const [weekDates, setWeekDates] = useState([]);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [title, setTitle] = useState(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateUnitProduction = () => {
    // 5 משבצות × 5 קוביות = 25 משבצות סה"כ
    const totalSquares = 25;
    return (maxValue - minValue) / totalSquares;
  };

  useEffect(() => {
    if (startDate) {
      const dates = [];
      for (let i = 0; i < Math.max(weeklyValues.length + 1, 8); i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i * 7);
        dates.push(date.toISOString().split('T')[0]);
      }
      setWeekDates(dates);
    }
  }, [startDate, weeklyValues.length]);

  const handleValueChange = (value) => {
    const newValues = [...weeklyValues];
    newValues[selectedWeek] = Number(value) || 0;
    setWeeklyValues(newValues);

    if (selectedWeek >= displayStartIndex + 7) {
      setDisplayStartIndex(selectedWeek - 7);
    } else if (selectedWeek < displayStartIndex) {
      setDisplayStartIndex(selectedWeek);
    }
  };

  useEffect(() => {
    if (selectedWeek >= displayStartIndex + 8) {
      setDisplayStartIndex(selectedWeek - 7);
    } else if (selectedWeek < displayStartIndex) {
      setDisplayStartIndex(selectedWeek);
    }
  }, [selectedWeek]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: minValue,
        max: maxValue,
        grid: {
          drawBorder: true,
          color: function(context) {
            const value = context.tick.value;
            const mainGridInterval = (maxValue - minValue) / 10;
            const isMainGrid = Math.abs((value - minValue) % mainGridInterval) < 0.001;
            
            return isMainGrid ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
          },
          lineWidth: function(context) {
            const value = context.tick.value;
            const mainGridInterval = (maxValue - minValue) / 10;
            const isMainGrid = Math.abs((value - minValue) % mainGridInterval) < 0.001;
            
            return isMainGrid ? 1 : 0.5;
          }
        },
        ticks: {
          count: 51, // 10 main intervals * 5 subdivisions + 1
          callback: function(value) {
            const mainGridInterval = (maxValue - minValue) / 10;
            const isMainGrid = Math.abs((value - minValue) % mainGridInterval) < 0.001;
            
            return isMainGrid ? value.toLocaleString() : '';
          }
        }
      }
    }
  };

  const visibleData = weeklyValues.slice(displayStartIndex, displayStartIndex + 8);
  const visibleDates = weekDates.slice(displayStartIndex, displayStartIndex + 8);

  const data = {
    labels: visibleDates.map(date => 
      new Date(date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Unit Production',
        data: visibleData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ],
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleDeleteClick = () => {
    if (!isOriginal) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete();
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Delete button - only shown for non-original graphs */}
      {!isOriginal && (
        <button 
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
          title="Delete Graph"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this graph? All data associated with it will be permanently removed.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mb-4 relative">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 cursor-pointer mb-2" onClick={handleTitleClick}>
            <h2 className="text-2xl font-bold">{title}</h2>
            {/* Pencil icon for editing title */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleKeyDown}
              className="text-2xl font-bold text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : null}
          <div className="text-lg text-gray-600">
            Unit Production: {calculateUnitProduction().toLocaleString()}
          </div>
        </div>
        <Line options={options} data={data} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Value
            </label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Value
            </label>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
            >
              {weekDates.slice(0, weeklyValues.length + 1).map((date, index) => (
                <option key={date} value={index}>
                  {new Date(date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              value={weeklyValues[selectedWeek] || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              className="border rounded-md p-2 w-full"
              min={minValue}
              max={maxValue}
            />
          </div>
          
          {selectedWeek === weeklyValues.length && (
            <div className="flex items-end">
              <button
                onClick={() => setWeeklyValues([...weeklyValues, 0])}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 h-[42px]"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
