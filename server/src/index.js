const express = require("express")
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

let connectedSockets = 0

const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server , {
    cors:{
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    connectedSockets++
    const socketId = socket.id
    console.log(`${socketId} has connected!`)
    socket.on("disconnect", () => {
        console.log(`${socketId} has disconnected!`)
        connectedSockets--
        console.log(connectedSockets)
    })
    socket.on("Loaded", () => {
        console.log(`${socketId} has loaded!`)
    })
    socket.on("login",(data) => {
        console.log(data)
        socket.emit("auth",{msg:"logged in"})
    })
    console.log(connectedSockets)
})

server.listen(8000,() => {
    console.log("Server is YeeYeeing")
})
