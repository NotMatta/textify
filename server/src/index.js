const express = require("express")
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

const app = express()
app.use(cors())

const server = http.createServer(app)

server.listen(8000,() => {
    console.log("Server is YeeYeeing")
})
