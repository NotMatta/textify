import { DisconnectSocket, HandleAuth, Validate } from "../utils/auth.js"
import { HandleFriendRequest } from "../utils/friends.js"
import { io } from "./socket.js"



io.on("connection", async (socket) => {
    const socketId = socket.id
    console.log(`${socketId} has connected!`)
    socket.on("disconnect", () => {
        console.log(`${socketId} has disconnected!`)
        DisconnectSocket(socketId)
    })
    HandleAuth(socket)
    Validate(socket)
    HandleFriendRequest(socket)
})
