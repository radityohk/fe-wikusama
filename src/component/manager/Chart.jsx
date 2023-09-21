import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LineChartComponent = () => {
  const headers = {
  'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  };

  const [data, setData] = useState([]);
  const [menuData, setMenuData] = useState([]); // State untuk data menu

  useEffect(() => {
    axios.get('http://localhost:8080/detail', {headers}) // Ganti dengan URL backend Anda
      .then(response => {
          setData(response.data.data);
        })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    axios.get('http://localhost:8080/menu', {headers}) // Ganti dengan URL untuk data menu
      .then(response => {
        setMenuData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  const calculateTotalPembelian = (menuId) => {
    const totalQty = data.reduce((total, item) => {
      if (item.id_menu === menuId) {
        return total + item.qty;
      }
      return total;
    }, 0);
    return totalQty;
  };

  const chartData = menuData.map(menuItem => {
    console.log(menuItem); // Tampilkan nilai menuItem untuk periksaan
    return {
      nama_menu: menuItem.nama_menu,
      total_pembelian: calculateTotalPembelian(menuItem.id),
    };
  });

  

  return (
    <div className='pt-16'>
      <LineChart width={950} height={500} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nama_menu" interval={0} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_pembelian" stroke="#8884d8" name="Total Pembelian" />
      </LineChart>
    </div>
  );
}

export default LineChartComponent;