const express = require(`express`)
const app = express()
app.use(express.json())
const userController =
require(`../controllers/transaksi.controller`)
app.get("/", userController.getAllTransaksi)
app.post("/add", userController.addTransaksi)
app.post("/find", userController.findTransaksi)
app.put("/:id", userController.updateTransaksi)
app.delete("/:id", userController.deleteTransaksi)
module.exports = app