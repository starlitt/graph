import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Mon', value: 755669 },
  { name: 'Tue', value: 755672 },
  { name: 'Wed', value: 755675 },
  { name: 'Thu', value: 755678 },
  { name: 'Fri', value: 755681 },
  { name: 'Sat', value: 755684 },
  { name: 'Sun', value: 755687 }
];

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Weekly Graph</h2>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[755660, 755690]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
