import prisma from "../prisma/prisma-client.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secret = process.env.SECRET

const HandleAuth = (socket) => {
    socket.on("login",async (data) => {
        console.log(data)
        const FoundUser = await prisma.user.findFirst({where:{username:data.username}})
        if (FoundUser){
            const Valid = await bcrypt.compare(data.password,FoundUser.password)
            const token = jwt.sign({userId: FoundUser.id},secret,{expiresIn: "1d"})
            Valid ? socket.emit("auth",{msg:"logged in",token}) : socket.emit("auth",{msg:"Wrong Data"})
            return
        }
        const encryptedPassword = await bcrypt.hash(data.password,12)
        const newUser = await prisma.user.create({data:{...data,password:encryptedPassword}})
        const token = jwt.sign({userId: newUser.id},secret,{expiresIn: "1d"})
        socket.emit("auth",{msg:"User created!",token})
    })
}

const Validate = (socket) => {
    socket.on("validation", async ({token}) => {
        const payload = async () => {try{
            const data = jwt.verify(token,secret)
            const FoundUser = await prisma.user.findUnique({where:{id: data.userId},select:{id:true,username:true,pfp:true}})
            return {...FoundUser}
        }catch(err){
            return null
        }}
        socket.emit("valid",{payload:await payload()})
    })
} 

export {
    HandleAuth,
    Validate
}
