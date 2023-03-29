const menuModel = require(`../models/index`).menu;
const Op = require(`sequelize`).Op;
const { path } = require(`../models/menu`);
const upload = require(`./upload-foto`).single(`gambar`);
const fs = require(`fs`);
const md5 = require(`md5`);
const mysql = require(`mysql2`);

exports.getAllMenu = async (request, response) => {
    menuModel.findAll()
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

exports.findMenu = async (request, response) => {
  let keyword = request.body.keyword;

  let menu = await menuModel.findAll({
    where: {
      [Op.or]: [
        { nama_menu: { [Op.substring]: keyword } },
        { jenis: { [Op.substring]: keyword } },
        { deskripsi: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: menu,
    message: `All menu have been loaded`,
  });
};

exports.addMenu = async (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to Upload` });
    }

    let data = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      gambar: request.file.filename,
      harga: request.body.harga
   }

   menuModel.create(data)
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
  });
    
};

exports.updateMenu = (request, response) => {
    let data = {
      nomor_menu: request.body.nomor_menu
    }

    let id_menu = request.params.id;


    menuModel.update(data, { where: { id: id_menu } })
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

exports.deleteMenu = (request, response) => {
  let id_menu = request.params.id;

  menuModel
    .destroy({ where: { id: id_menu } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data menu has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
