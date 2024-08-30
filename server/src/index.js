import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import prisma from "../prisma/prisma-client.js"
import bcrypt from "bcrypt"
import { HandleAuth, Validate } from "../utils/auth.js"

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
    HandleAuth(socket)
    Validate(socket)
    console.log(connectedSockets)
})

server.listen(8000,() => {
    console.log("Server is YeeYeeing")
})
