const mejaModel = require(`../models/index`).meja;

const ubahStatus = () => {
    const now = new Date();
    const satuJamYangLalu = new Date(now.getTime() - 60 * 60 * 1000);

    transaksi.forEach((data) => {
      if (data.tanggal <= satuJamYangLalu) {
        mejaModel.update( 
        {status: `tersedia`},
        {where: {id: request.body.id_meja}})
      }
    });
  };

module.exports = ubahStatus
  