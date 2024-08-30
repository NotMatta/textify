"use client"

import { useEffect } from "react"
import { useSocket } from "./socket-provider"
import { useToast } from "./ui/use-toast"

const EventSniffer = () => {

    const socket = useSocket()
    const {toast} = useToast()

    useEffect(() => {
        socket?.on("response",({msg}) => {
            toast({
                title:"Notice",
                description: msg
            })
        })
    },[socket,toast])

    return (
        <></>
    )
}

export default EventSniffer
