"use client"
import Cookies from "js-cookie";
import { useState, createContext, useEffect, useContext } from "react";
import { useSocket } from "./socket-provider";
import { useRouter } from "next/navigation";

const sessionContext = createContext({})

const SessionProvider = ({children}) => {

    const router = useRouter() 
    const [load,setLoading] = useState(false)
    const socket = useSocket()
    const [session,setSession] = useState({
        status: "loading",
        data: {
            id: "",
            username: "",
            pfp: ""
        }
    })


    useEffect(() => {
        if (!load && socket){
            const token = Cookies.get("token")
            if (!token){
                console.log("no token stored")
                let newSession = {...session,status:"unauthenticated"}
                setSession(newSession)
                router.push("/auth")
            } else{
                socket.emit("validation",{token})
                socket.on("valid",(res) => {
                    console.log(res.payload)
                    if(res.payload ==  null){
                        Cookies.remove("token")
                        let newSession = {...session,status:"unauthenticated"}
                        setSession(newSession)
                        router.push("/auth")
                    } else {
                        let newSession = {status:"authenticated",data:{...res.payload}}
                        console.log(newSession)
                        setSession(newSession)
                    }
                    socket.off("valid")
                })
            }
            setLoading(true)
        }
    },[load,session,socket,router])

    return(
        <sessionContext.Provider value={{session}}>
            {children}
        </sessionContext.Provider>
    )
}

const useSession = () => {
    return useContext(sessionContext).session
}


export {
    SessionProvider,
    useSession
}
