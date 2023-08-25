const express = require(`express`);
const cors = require(`cors`);
const app = express();
app.use(express.json());
const userController = require(`../controllers/user.controller`);
const { auth , isRole} = require(`../auth/auth`);
// const access = require(`../auth/validate`)

app.get("/", auth, userController.getAllUser);
app.post("/add", auth, userController.addUser);
app.post("/login", userController.login);
app.post("/find", auth, userController.findUser);
app.get("/:id", userController.findMenubyId);
app.put("/:id", auth, userController.updateUser);
app.delete("/:id", auth, userController.deleteUser);
module.exports = app;
