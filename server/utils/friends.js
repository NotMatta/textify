import { io } from "../src/socket.js"
import prisma from "../prisma/prisma-client.js"

const FetchFriendRequests = async (userId) => {
    const FoundFriendRequests = await prisma.user.findUnique({
        where:{id:userId},
        include:{
            friends2: {
                where:{status:"pending"},
                include:{
                    User1:{
                        select:{
                            id: true,
                            username: true,
                            pfp: true,
                            socket:{
                                select:{socketId:true}
                            }
                        }
                    }
                }
            }
        }})
    return FoundFriendRequests.friends2

}

const FetchFriends = async (userId) => {
    const FoundFriends = await prisma.user.findUnique({
        where:{
            id:userId
        },
        include:{
            friends1:{where:{status: "accepted"},
                include:{User2:{select:
                    {id: true,username:true,pfp:true}
                }}},
            friends2:{
                where:{status: "accepted"},
                include:{User1:{select:
                    {id: true,username:true,pfp:true}
                }}}
        }
    })
    const Friends = []
    FoundFriends.friends1.map((FriendShip) => Friends.push(FriendShip.User2))
    FoundFriends.friends2.map((FriendShip) => Friends.push(FriendShip.User1))
    return Friends
}

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
                const Requests = await FetchFriendRequests(FoundUser.id)
                io.sockets.sockets.get(FoundUser.socket.socketId)?.emit("resFriendRequests",{Requests})
                socket.emit("response",{msg: `Request to ${username} is sent!`})
            } else {
                socket.emit("response",{msg: `Your Friend request to ${username} is already ${FoundFriendShips[0].status}`})
            }
        } else {
            socket.emit("response",{msg: `Cannot find ${username}`})
        }
    }) 
}

const getFriendRequests = (socket) => {
    socket.on("getFriendRequests",async ({userId}) => {
        console.log(`${userId} requested friend requests`)
        const Requests = await FetchFriendRequests(userId)
        socket.emit("resFriendRequests",{Requests})
    } )
}

const getFriends = (socket) => {
    socket.on("reqFriends", async ({userId}) => {
        console.log(`${userId} requested his friends`)
        const Friends = await FetchFriends(userId)
        socket.emit("resFriends",{Friends})
    })
}

const AcceptRequest = (socket) => {
    socket.on("acceptRequest", async ({userId,requestId}) => {
        await prisma.friendship.update({where:{id:requestId},data:{status:"accepted"}})
        const Requests = await FetchFriendRequests(userId)
        const Friends = await FetchFriends(userId)
        socket.emit("resFriends",{Friends})
        socket.emit("resFriendRequests",{Requests})
        socket.emit("response",{msg: "Friendship started"})
    })
}

const RejectRequest = (socket) => {
    socket.on("rejectRequest", async ({userId,requestId}) => {
        await prisma.friendship.update({where:{id:requestId},data:{status:"rejected"}})
        const Requests = await FetchFriendRequests(userId)
        const Friends = await FetchFriends(userId)
        socket.emit("resFriends",{Friends})
        socket.emit("resFriendRequests",{Requests})
        socket.emit("response",{msg: "Friendship rejected"})
    })
}

export {
    HandleFriendRequest,
    getFriendRequests,
    AcceptRequest,
    RejectRequest,
    getFriends
}

