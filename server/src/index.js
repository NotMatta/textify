import { DisconnectSocket, HandleAuth, Validate } from "../utils/auth.js"
import { AcceptRequest, HandleFriendRequest, RejectRequest, getFriendRequests, getFriends } from "../utils/friends.js"
import { io } from "./socket.js"



io.on("connection", async (socket) => {
    const socketId = socket.id
    socket.emit("checkId")
    console.log(`${socketId} has connected!`)
    socket.on("disconnect", () => {
        console.log(`${socketId} has disconnected!`)
        DisconnectSocket(socketId)
    })
    HandleAuth(socket)
    Validate(socket)
    HandleFriendRequest(socket)
    getFriendRequests(socket)
    getFriends(socket)
    AcceptRequest(socket)
    RejectRequest(socket)
})
