import express from "express"
import { route } from "./routes"
import bodyParser from "body-parser"
const cors = require("cors")
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

route(app)

app.listen(4000, () => {
    console.log("connect to port 4000")
})