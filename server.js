const express = require("express")
const app = express()
var bodyParser = require('body-parser')
const PORT = 8080
const cors = require(`cors`)
const cron = require(`node-cron`)
const path = require(`path`)
app.use(cors())
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use('/foto', express.static(path.join(__dirname,'./foto')))
const ubahStatus = require(`./utils/ubahstatus`)

const userRoute = require(`./routes/user.route`)
const mejaRoute = require(`./routes/meja.route`)
const menuRoute = require(`./routes/menu.route`)
const transaksiRoute = require(`./routes/transaksi.route`)
const detailRoute = require(`./routes/detail.route`)


app.use("/user", userRoute)
app.use("/meja", mejaRoute)
app.use("/menu", menuRoute)
app.use("/transaksi", transaksiRoute)
app.use("/detail", detailRoute)

cron.schedule('0 * * * *', () => {
    ubahStatus();
  });

app.use(express.static(__dirname))
app.listen(PORT, () => {
    console.log(`PORT ${PORT}`)
    })