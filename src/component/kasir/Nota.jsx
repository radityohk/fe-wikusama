import React from "react";
import jsPDF from "jspdf";
import logo from '../../nota/assets/coffee-logo-png-7520.png'

export default function NotaPDF({ transaksi }) {
  const cetakNota = () => {
    // Buat instance jsPDF dengan ukuran kertas khusus
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 200], // Ukuran kertas 80x140mm
    });

    
    // Tambahkan logo kafe di tengah atas
    const logoCafe = logo
    const imgWidth = 40;
    const imgHeight = 40;
    doc.addImage(logoCafe, "PNG", 20, 10, imgWidth, imgHeight);

    // Teks yang terpusat
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Warna teks hitam
    doc.text("NOTA TRANSAKSI", 40, 60, { align: "center" });
    doc.text(`Nama Pelanggan: ${transaksi.nama_pelanggan}`, 40, 70, {
      align: "center",
    });
    doc.text(`Nomor Meja: ${transaksi.id_meja}`, 40, 80, { align: "center" });

    // Tabel untuk item-menu dan harga
    const itemY = 90;
    const hargaX = 60;
    const hargaY = itemY;

    // Header tabel
    doc.text("BARANG", 5, itemY);
    doc.text("QTY", 40, itemY); // Tambahkan kolom "Qty"
    doc.text("HARGA", hargaX, itemY);

    transaksi.detail_transaksi.forEach((detail, index) => {
      const yPos = itemY + (index + 1) * 10;
      doc.text(detail.menu.nama_menu, 10, yPos);
      doc.text(detail.qty.toString(), 40, yPos); // Tambahkan jumlah "Qty"
      doc.text(detail.menu.harga.toString(), hargaX, yPos);
    });

    doc.text(`--------------------------------------------------`,10, 120);

    // Total Harga
    doc.text(`Total Harga: ${transaksi.total}`, 40, 130, { align: "center" });

    // Tanggal dan waktu cetak struk
    const now = new Date();
    doc.text(`Cetak pada: ${now.toLocaleString()}`, 40, 140, { align: "center" });

    // Ucapan terimakasih
    doc.text("Terima kasih atas kunjungan Anda!", 40, 150, { align: "center" });

    // Simpan dokumen PDF dengan nama file
    doc.save("nota_transaksi.pdf");
  };

  return (
    <div>
      {/* Tombol untuk mencetak nota */}
      <button
        onClick={() => cetakNota()}
        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
      >
        Cetak Nota
      </button>
    </div>
  );
}
