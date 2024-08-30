"use client"

import { useSocket } from "@/components/socket-provider"
import { useToast } from "@/components/ui/use-toast"
import { PlugZap, Unplug } from "lucide-react"
import { useEffect, useState } from "react"

const ConnectionChecker = () => {
    const socket = useSocket()
    const {toast} = useToast()
    const [offline,setOffline] = useState(false)
    useEffect(() => {
        socket?.on("kys",() => {
            toast({
                title:"Disconnected",
                description: "Another instance of Textify is open, refresh to regain connectivity"
            })
            setOffline(true)
        })
    },[socket,toast])

    return (
        <div className={`${!socket || offline ? "absolute" : "hidden"} top-0 left-0 w-full h-full bg-background flex justify-center items-center z-10`}>
            {offline && <Unplug className="animate-pulse repeat-infinite size-32"/>}
            {!socket && <PlugZap className="animate-pulse repeat-infinite size-32"/>}
        </div>
    )
}
export default ConnectionChecker
