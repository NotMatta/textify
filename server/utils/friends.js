import { io } from "../src/socket.js"
import prisma from "../prisma/prisma-client.js"

const HandleFriendRequest = (socket) => {
    socket.on("sendRequest",async ({userId,username}) => {
        const FoundUser = await prisma.user.findUnique({where:{username},include:{socket:{select:{socketId: true}}}})
        if (FoundUser){
            const FoundFriendShips = await prisma.friendship.findMany({where:{
                OR:[
                    {
                        userId1: userId,
                        userId2: FoundUser.id
                    },
                    {
                        userId1: FoundUser.id,
                        userId2: userId
                    }
                ]
            }})
            if(FoundFriendShips.length == 0){
                await prisma.friendship.create({data:{
                    userId1: userId,
                    userId2: FoundUser.id,
                    status: "pending"
                }})
                io.sockets.sockets.get(FoundUser.socket.socketId)?.emit("refetchFriends")
                console.log(FoundUser)
                socket.emit("response",{msg: `Request to ${username} is sent!`})
            } else {
                socket.emit("response",{msg: `Your Friend request to ${username} is already ${FoundFriendShips[0].status}`})
            }
        } else {
            socket.emit("response",{msg: `Cannot find ${username}`})
        }
    }) 
}

export {
    HandleFriendRequest
}

