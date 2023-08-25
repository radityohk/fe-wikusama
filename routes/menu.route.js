const express = require(`express`);
const app = express();
app.use(express.json());
const userController = require(`../controllers/menu.controller`);
const { auth } = require(`../auth/auth`);

app.get("/", auth, userController.getAllMenu);
app.post("/add", auth, userController.addMenu);
app.post("/find", userController.findMenu);
app.get("/:id", userController.findMenubyId);
app.put("/:id", auth, userController.updateMenu);
app.delete("/:id", auth, userController.deleteMenu);
module.exports = app;
