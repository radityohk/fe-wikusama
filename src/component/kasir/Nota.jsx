import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    header: {
      textAlign: "center",
      fontSize: 20,
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    label: {
      fontSize: 12,
    },
    value: {
      fontSize: 12,
      fontWeight: "bold",
    },
  });

const NotaTransaksiPDF = ({ transaksi }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Nota Transaksi</Text>
          <Text style={styles.subtitle}>ID Transaksi: {transaksi.id}</Text>
          <Text>Nama Pelanggan: {transaksi.nama_pelanggan}</Text>
          <Text>Nomor Meja: {transaksi.meja.nomor_meja}</Text>
          <Text>Total Harga: {transaksi.total}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>ID Menu</Text>
            <Text style={styles.tableCell}>Nama Menu</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Harga</Text>
          </View>
          {transaksi.detail_transaksi.map((detail) => (
            <View style={styles.tableRow} key={detail.id}>
              <Text style={styles.tableCell}>{detail.menu.id}</Text>
              <Text style={styles.tableCell}>{detail.menu.nama_menu}</Text>
              <Text style={styles.tableCell}>{detail.qty}</Text>
              <Text style={styles.tableCell}>{detail.harga}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default NotaTransaksiPDF;
