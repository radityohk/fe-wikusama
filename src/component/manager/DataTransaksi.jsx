import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DataTransaksi() {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };
    const [transaksi, setTransaksi] = useState([]);
    const [filteredDate, setFilteredDate] = useState(null);
    const [filteredMonth, setFilteredMonth] = useState(null);
    const [filteredKasir, setFilteredKasir] = useState("");
    const [filteredTransaksi, setFilteredTransaksi] = useState(null);
    const [uniqueKasirs, setUniqueKasirs] = useState([]);
    console.log(filteredTransaksi)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/transaksi/", { headers })
                setTransaksi(response.data.data)

                const uniqueKasirNames = [...new Set(response.data.data.map(item => item.user.nama_user))];
                setUniqueKasirs(uniqueKasirNames);
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    function dateFormat(date) {
        const dateObj = new Date(date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('id-ID', options);
        return formattedDate;
    }

    const resetFilters = () => {
        setFilteredDate(null);
        setFilteredTransaksi(null);
        setFilteredKasir("");
        setFilteredMonth(null);
    };

    const filterByDate = (date) => {
        if (date) {
            const filteredData = transaksi.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                return tgl_transaksi.toDateString() === date.toDateString();
            });
            setFilteredTransaksi(filteredData);
            setFilteredMonth(null);
        }
    };

    const filterByMonth = (date) => {
        if (date) {
            const filteredData = transaksi.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                const dateinput = new Date(date)
                return (
                    tgl_transaksi.getMonth() === dateinput.getMonth() &&
                    tgl_transaksi.getFullYear() === dateinput.getFullYear()
                );
            });
            setFilteredTransaksi(filteredData);
            setFilteredDate(null);
            console.log(filteredData)
        }
    };

    const filterByKasir = (kasirName) => {
        if (kasirName === "Pilih Kasir") {
            resetFilters();
        } else {
            const filteredData = transaksi.filter((t) => {
                return t.user.nama_user === kasirName;
            });
            setFilteredTransaksi(filteredData);
            setFilteredKasir(kasirName);
        }
    };


    return (
        <div>
            <div className="mt-5 mx-5 flex">
                <div className="flex p-2 bg-gray-100 rounded-md border shadow-sm">
                    <div className="mr-4">
                        <label htmlFor="datePicker">Filter Tanggal:</label>
                        <DatePicker
                            id="datePicker"
                            selected={filteredDate}
                            onChange={(date) => {
                                setFilteredDate(date);
                                filterByDate(date);
                            }}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="mr-4">
                        <label htmlFor="monthPicker">Filter Bulan:</label>
                        <DatePicker
                            id="monthPicker"
                            selected={filteredMonth}
                            onChange={(date) => {
                                setFilteredMonth(date);
                                filterByMonth(date);
                            }}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                        />
                    </div>
                    <div className="mr-4">
                        <label htmlFor="kasirSelect">Filter Nama Kasir:</label>
                        <select
                            id="kasirSelect"
                            value={filteredKasir}
                            onChange={(e) => {
                                const selectedKasir = e.target.value;
                                setFilteredKasir(selectedKasir);
                                filterByKasir(selectedKasir);
                            }}
                        >
                            <option value="">Pilih Kasir</option>
                            {uniqueKasirs.map((kasirName) => (
                                <option key={kasirName} value={kasirName}>
                                    {kasirName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={resetFilters}>Reset Filter</button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium text-gray-900">Nama Kasir</th>
                            <th scope="col" className="px-6 py-4 font-medium text-gray-900">Tanggal Transaksi</th>
                            <th scope="col" className="px-6 py-4 font-medium text-gray-900">Jumlah</th>
                            <th scope="col" className="px-6 py-4 font-medium text-gray-900">Total Harga</th>
                            <th scope="col" className="px-6 py-4 font-medium text-gray-900">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                        {filteredTransaksi === null ? (
                            <>
                                {transaksi.map((transaksi) => (
                                    <tr key={transaksi.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{transaksi.user.nama_user}</td>
                                        <td className="px-6 py-4">{dateFormat(transaksi.tgl_transaksi)}</td>
                                        <td className="px-6 py-4">{transaksi.detail_transaksi[0].qty}</td>
                                        <td className="px-6 py-4">{transaksi.total}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                                    Lunas
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                {filteredTransaksi.map((transaksi) => (
                                    <tr key={transaksi.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{transaksi.user.nama_user}</td>
                                        <td className="px-6 py-4">{dateFormat(transaksi.tgl_transaksi)}</td>
                                        <td className="px-6 py-4">{transaksi.detail_transaksi[0].qty}</td>
                                        <td className="px-6 py-4">{transaksi.total}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                                    Lunas
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    )
}