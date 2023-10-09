import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = () => {
  const headers = {
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/detail/statistik', { headers })
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);

  return (
    <div className='pt-16'>
      <BarChart width={950} height={500} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nama_menu" interval={0} textAnchor="middle" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_pembelian" fill="#8884d8" name="Total Pembelian" />
      </BarChart>
    </div>
  );
}

export default BarChartComponent;