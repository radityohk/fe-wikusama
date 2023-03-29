const express = require(`express`)
const app = express()
app.use(express.json())
const userController =
require(`../controllers/meja.controller`)
app.get("/", userController.getAllMeja)
app.post("/add", userController.addMeja)
app.post("/find", userController.findMeja)
app.put("/:id", userController.updateMeja)
app.delete("/:id", userController.deleteMeja)
module.exports = app