import express from "express"
import { route } from "./routes"
import bodyParser from "body-parser"

import { createServer } from 'http';
import { Server } from "socket.io";
import { NotiFromServer } from "./controller/IO.controller";
const app = express()
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const cors = require("cors")
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

route(app)

io.on('connection', (socket) => {

    socket.on('request to borrow book', (data) => {
        NotiFromServer("Có người muốn mượn sách của bạn", data.host.id)
    })
    // Xử lý khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(4000, () => {
    console.log("connect to port 4000")
})