import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DataTransaksi() {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };
    const [transaksi, setTransaksi] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredTransaksi, setFilteredTransaksi] = useState(null);
    const [filterMonthly, setFilterMonthly] = useState(false);
    const [filteredMonth, setFilteredMonth] = useState(null);
    const [kasirFilter, setKasirFilter] = useState("");
    const [uniqueKasirs, setUniqueKasirs] = useState([]);

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
        setSelectedDate(null);
        setFilteredTransaksi(null);
        setKasirFilter("");
        setFilterMonthly(false);
        setFilteredMonth(null);
    };

    const filterByDate = (date) => {
        if (date) {
            const filteredData = transaksi.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                return tgl_transaksi.toDateString() === date.toDateString();
            });
            setFilteredTransaksi(filteredData);
            setFilterMonthly(false); // Reset filter monthly
        }
    };

    const filterByMonth = (date) => {
        if (date) {
            const filteredData = transaksi.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                const selectedMonth = new Date(date);
                console.log(tgl_transaksi)
                console.log(selectedMonth)
                return tgl_transaksi.getMonth() === selectedMonth.getMonth() &&
                    tgl_transaksi.getFullYear() === selectedMonth.getFullYear();
            });
            setFilteredTransaksi(filteredData);
            setFilterMonthly(true); // Set filter monthly active
            setFilteredMonth(date); // Save filtered month
        }
    };

    const filterByKasir = (kasirName) => {
        if (kasirName === "Pilih Kasir") {
            resetFilters(); // Mengatur ulang filter saat memilih "Pilih Kasir"
        } else {
            const filteredData = transaksi.filter((t) => {
                return t.user.nama_user === kasirName;
            });
            setFilteredTransaksi(filteredData);
            setSelectedDate(null);
            setKasirFilter(kasirName);

            if (filterMonthly) {
                setFilterMonthly(true);
            }
        }
    };

    const filterData = () => {
        let filteredData = [...transaksi];

        if (selectedDate) {
            filteredData = filteredData.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                return tgl_transaksi.toDateString() === selectedDate.toDateString();
            });
        }

        if (kasirFilter !== "" && kasirFilter !== "Pilih Kasir") {
            filteredData = filteredData.filter((t) => {
                return t.user.nama_user === kasirFilter;
            });
        }

        return filteredData;
    };

    return (
        <div>
            <div className="mt-5 mx-5 flex">
                <div className="flex p-2 bg-gray-100 rounded-md border shadow-sm">
                    <span className="flex-none">Filter By  : </span>
                    {/* Dropdown untuk filter Tanggal (Harian/Bulanan) */}
                    <select
                        className="pl-1 bg-gray-100"
                        value={filterMonthly ? "monthly" : "daily"}
                        onChange={(e) => {
                            if (e.target.value === "monthly") {
                                resetFilters(); // Mengatur ulang filter saat beralih ke "Bulanan"
                                setFilterMonthly(true);
                            } else {
                                resetFilters(); // Mengatur ulang filter saat beralih ke "Harian"
                                setFilterMonthly(false);
                            }
                        }}
                    >
                        <option value="daily">Harian</option>
                        <option value="monthly">Bulanan</option>
                    </select>
                    <select
                        className="pl-1 bg-gray-100"
                        value={kasirFilter}
                        onChange={(e) => {
                            filterByKasir(e.target.value);
                        }}
                    >
                        <option value="">Pilih Kasir</option>
                        {uniqueKasirs.map((kasir, index) => (
                            <option key={index} value={kasir}>
                                {kasir}
                            </option>
                        ))}
                    </select>
                    {filterMonthly ? (
                        <DatePicker
                            className="pl-1 bg-gray-100"
                            showMonthYearPicker
                            selected={filteredMonth}
                            onChange={(date) => {
                                setSelectedDate(date);
                                filterByMonth(date);
                            }}
                        />
                    ) : (
                        <DatePicker
                            className="pl-1 bg-gray-100"
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                filterByDate(date);
                            }}
                        />
                    )}
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
                        {selectedDate === null || selectedDate === undefined ? (
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
                                {filterData().map((transaksi) => (
                                    <tr key={transaksi.id_transaksi} className="hover:bg-gray-50">
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
        </div>
    )
}
