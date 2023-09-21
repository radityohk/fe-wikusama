import React, { useEffect, useState } from "react";
import axios from "axios";
import { PrintBill } from "./PrintBill";

export default function Riwayat() {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  };
  const [transaksi, setTransaksi] = useState([]);
  const [meja, setMeja] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filteredName, setFilteredName] = useState(null);
  const [namaPelanggan, setNamaPelanggan] = useState("");

  useEffect(() => {
    const fecthDatas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/transaksi/", {
          headers,
        });
        setTransaksi(response.data.data);
        console.log(transaksi);

        const res = await axios.get("http://localhost:8080/meja/", { headers });
        setMeja(res.data.data);
        console.log(meja);
      } catch (err) {
        console.log(err);
      }
    };
    fecthDatas();
  }, []);

  const handleBayar = async (id) => {
    const selectedTransaksi = transaksi.find((select) => select.id === id);
    const selectedMeja = meja.find(
      (select) => select.id === selectedTransaksi.meja.id
    );

    const updatedStatusTransaksi = {
      ...selectedTransaksi,
      status: "lunas",
    };

    const updatedStatusMeja = {
      ...selectedMeja,
      status: "tersedia",
    };

    try {
      await axios.put(
        "http://localhost:8080/transaksi/" + id,
        updatedStatusTransaksi,
        { headers }
      );
      await axios.put(
        "http://localhost:8080/meja/" + selectedMeja.id,
        updatedStatusMeja,
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const selectedTransaksi = transaksi.find((select) => select.id === id);
      // const selectedMeja = meja.find((select) => select.id === selectedTransaksi.meja.id)

      // const updatedStatusMeja = {
      //     ...selectedMeja,
      //     status: "tersedia"
      // }

      await axios.delete("http://localhost:8080/transaksi/" + id, { headers });
      // await axios.put("http://localhost:8080/meja/" + selectedMeja.id, updatedStatusMeja, {headers})
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/transaksi/findby",
        { keyword },
        { headers }
      );
      const data = await response.data.data;
      setFilteredName(data);
      console.log(filteredName);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="flex p-2 ml-5 bg-gray-100 rounded-md border shadow-sm">
        <input
          type="text"
          value={keyword}
          className="pl-1 bg-gray-100"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search keyword"
        />
        <button
          className="ml-2 bg-cyan-100 p-1 rounded-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Nama Pelanggan
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Nomor Meja
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Total Harga
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Status
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Cetak Nota
              </th>
              {/* <th scope="col" className="px-6 py-4 font-medium text-gray-900"></th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredName && filteredName.length > 0
              ? filteredName.map((transaksi) => (
                  <tr key={transaksi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{transaksi.nama_pelanggan}</td>
                    <td className="px-6 py-4">
                      Meja nomor {transaksi.id_meja}
                    </td>
                    <td className="px-6 py-4">{transaksi.total}</td>
                    <td className="px-6 py-4">
                      {transaksi.status === "belum bayar" ? (
                        <div className="flex gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            Belum Lunas
                          </span>
                          <button
                            onClick={() => handleBayar(transaksi.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-rose-600"
                          >
                            Bayar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            Lunas
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              : transaksi.map((transaksi) => (
                  <tr key={transaksi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{transaksi.nama_pelanggan}</td>
                    <td className="px-6 py-4">
                      Meja nomor {transaksi.meja.nomor_meja}
                    </td>
                    <td className="px-6 py-4">{transaksi.total}</td>
                    <td className="px-6 py-4">
                      {transaksi.status === "belum bayar" ? (
                        <div className="flex gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            Belum Lunas
                          </span>
                          <button
                            onClick={() => handleBayar(transaksi.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-rose-600"
                          >
                            Bayar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            Lunas
                          </span>
                        </div>
                      )}
                    </td>
                    
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
