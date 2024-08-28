import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import prisma from "../prisma/prisma-client.js"
import bcrypt from "bcrypt"

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
    socket.on("login",async (data) => {
        console.log(data)
        const FoundUser = await prisma.user.findFirst({where:{username:data.username}})
        if (FoundUser){
            const Valid = await bcrypt.compare(data.password,FoundUser.password)
            Valid ? socket.emit("auth",{msg:"logged in"}) : socket.emit("auth",{msg:"Wrong Data"})
            return
        }
        const encryptedPassword = await bcrypt.hash(data.password,12)
        const newUser = await prisma.user.create({data:{...data,password:encryptedPassword}})
        console.log(newUser)
        socket.emit("auth",{msg:"User created!"})
        
    })
    console.log(connectedSockets)
})

server.listen(8000,() => {
    console.log("Server is YeeYeeing")
})
