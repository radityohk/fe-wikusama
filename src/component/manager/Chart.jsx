import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend
)
export default function ChartTransaksi() {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };
    const [transaksi, setTransaksi] = useState([])
    const [menu, setMenu] = useState([])

    useEffect(() => {
        const fecthDatas = async () => {
            try {
                const response = await axios.get("http://localhost:8080/transaksi/", {headers})
                setTransaksi((response.data.transaksi).filter((select) => select.status === "lunas"))

                const res = await axios.get("http://localhost:8080/menu/", {headers})
                setMenu(res.data.menu)
            } catch (err) {
                console.log(err)
            }
        }
        fecthDatas()
    }, [])

    const data = {
        labels: menu
            .sort((a, b) =>
                transaksi.reduce(
                    (total, transaksi) => {
                        const detailTransaksiA = transaksi.detail_transaksi.find(
                            (dt) => dt.id_menu === a.id_menu
                        );
                        const detailTransaksiB = transaksi.detail_transaksi.find(
                            (dt) => dt.id_menu === b.id_menu
                        );
                        return total + (detailTransaksiB?.qty || 0) - (detailTransaksiA?.qty || 0);
                    },
                    0
                )
            )
            .map((item) => item.nama_menu),
        datasets: [
            {
                label: 'Penjualan',
                //2 argument: accumulator acc, elemen yg diproses(menu)
                data: menu.reduce((acc, menu) => {
                    const totalQty = transaksi.reduce((total, transaksi) => {
                        //mencari id yg sama 'id_menu' di detail dan menu
                        const detailTransaksi = transaksi.detail_transaksi.find(
                            (dt) => dt.id_menu === menu.id_menu
                        );
                        //jika ditemukan, ditambahkan ke total yang sedang berjalan menggunakan ekspresi total + detailTransaksi.qty.
                        if (detailTransaksi) {
                            return total + detailTransaksi.qty;
                        }
                        return total;
                    }, 0);
                    return [...acc, totalQty];
                    //mengurutkan dari yang terbanyak
                }, []).sort((a, b) => b - a),

                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    )
}