import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CommonBarChart = ({ pending,approved,rejected }) => {
  const chartData = [
    { name: 'Pending', value:pending || 0 },
    { name: 'Approved', value: approved || 0 },
    { name: 'Rejected', value: rejected || 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={chartData}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CommonBarChart;
