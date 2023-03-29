const express = require(`express`)
const app = express()
app.use(express.json())
const userController =
require(`../controllers/menu.controller`)
app.get("/", userController.getAllMenu)
app.post("/add", userController.addMenu)
app.post("/find", userController.findMenu)
app.put("/:id", userController.updateMenu)
app.delete("/:id", userController.deleteMenu)
module.exports = app