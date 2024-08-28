"use client"
import { useContext, useState, useEffect, createContext } from "react";
import io from "socket.io-client"

const SocketContext = createContext()

const SocketProvider = ({children}) => {
    const [socket,setSocket] = useState()
    useEffect(() => {
        const newSocket= io.connect("http://localhost:8000")
        setSocket(newSocket)
        return () => newSocket.disconnect()
    },[])
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

const useSocket = () => {
    return useContext(SocketContext).socket
}

export {
    SocketProvider,
    useSocket
}
