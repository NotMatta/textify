import prisma from "../prisma/prisma-client.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { io } from "../src/socket.js"

const secret = process.env.SECRET

const DisconnectSocket = async (socketId) => {
    await prisma.userSocket.deleteMany({where:{socketId}})
}

const DisconnectOldSocket = async (userId) => {
    const FoundSocket = await prisma.userSocket.findMany({where:{userId}})
    if (FoundSocket != 0){
        const {socketId} = await prisma.userSocket.delete({where:{userId}})
        io.sockets.sockets.get(socketId)?.emit("kys")
    }
}

const CreateSocketId = async (socketId,userId) => {
    await DisconnectOldSocket(userId)    
    const FoundSocket = await prisma.userSocket.findMany({where:{userId}})
    if (FoundSocket != 0){
        await prisma.userSocket.update({where:{userId},data:{socketId}})
        io.sockets.sockets.get(FoundSocket[0].socketId)?.emit("kys")
    } else {
        await prisma.userSocket.create({data:{userId,socketId}})
    }
}

const HandleAuth = (socket) => {
    socket.on("login",async (data) => {
        console.log(data)
        const FoundUser = await prisma.user.findFirst({where:{username:data.username}})
        if (FoundUser){
            const Valid = await bcrypt.compare(data.password,FoundUser.password)
            const token = jwt.sign({userId: FoundUser.id},secret,{expiresIn: "1d"})
            if(Valid){
                CreateSocketId(socket.id,FoundUser.id)
                socket.emit("auth",{msg:"logged in",token})
            }
            else{
                socket.emit("auth",{msg:"Wrong Data"})
            }
            return
        }
        const encryptedPassword = await bcrypt.hash(data.password,12)
        const newUser = await prisma.user.create({data:{...data,password:encryptedPassword}})
        const token = jwt.sign({userId: newUser.id},secret,{expiresIn: "1d"})
        CreateSocketId(socket.id,newUser.id)
        socket.emit("auth",{msg:"User created!",token})
    })
}

const Validate = (socket) => {
    socket.on("validation", async ({token}) => {
        const payload = async () => {try{
            const data = jwt.verify(token,secret)
            const FoundUser = await prisma.user.findUnique({where:{id: data.userId},select:{id:true,username:true,pfp:true}})
            CreateSocketId(socket.id,FoundUser.id)
            return {...FoundUser}
        }catch(err){
            return null
        }}
        socket.emit("valid",{payload:await payload()})
    })
} 

export {
    HandleAuth,
    Validate,
    DisconnectSocket
}
