const transaksiModel = require(`../models/index`).transaksi;
const mejaModel = require(`../models/index`).meja;
const Op = require(`sequelize`).Op;
const { path } = require(`../models/transaksi`);
const fs = require(`fs`);
const md5 = require(`md5`);
const mysql = require(`mysql2`);

exports.getAllTransaksi = async (request, response) => {
    transaksiModel.findAll()
    .then(result => {
        response.json({
            data: result
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
};

exports.findTransaksi = async (request, response) => {
  let keyword = request.body.keyword;

  let transaksi = await transaksiModel.findAll({
    where: {
      [Op.or]: [
        { nama_transaksi: { [Op.substring]: keyword } },
        { jenis: { [Op.substring]: keyword } },
        { deskripsi: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: transaksi,
    message: `All transaksi have been loaded`,
  });
};

exports.addTransaksi = async (request, response) => {

  let check = await transaksiModel.findOne({
    where: {
      id_meja: request.body.id_meja,
    }
  })

  if (check != null ){
    return response.json({
      message: "Meja sudah dipesan"
    })
  }
  
    let data = {
     tgl_transaksi: request.body.tgl_transaksi,
     id_user: request.body.id_user,
     id_meja: request.body.id_meja,
     nama_pelanggan: request.body.nama_pelanggan,
     status: request.body.status

   }

   transaksiModel.create(data)
   .then(result => {
       response.json ({
           message: "Data Berhasil Ditambahkan",
           data: result
       })
   })
   .catch(error => {
    response.json({
        message: error.message
    })
})
};

exports.updateTransaksi = (request, response) => {
  let data = {
    tgl_transaksi: request.body.tgl,
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status

  }

    let id_transaksi = request.params.id;


    transaksiModel.update(data, { where: { id: id_transaksi } })
    .then(result => {
        response.json ({
            success: true,
            message: "Data Berhasil Diganti",
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
};

exports.deleteTransaksi = (request, response) => {
  let id_transaksi = request.params.id;

  transaksiModel
    .destroy({ where: { id: id_transaksi } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data transaksi has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
