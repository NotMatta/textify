"use client"

import { useEffect, useState } from "react"
import { useSession } from "./session-provider"
import { useSocket } from "./socket-provider"

const FriendBox = ({friend}) => {
    return(
        <div className="shrink-0 flex items-center gap-1 px-2 border h-16 rounded-xl w-full">
            <img src={friend.pfp}
                className="size-12 rounded-full object-cover"/>
            <div className="flex flex-col">
                <p className="font-bold text-sm">{friend.username}</p>
                <p className="text-xs opacity-50">Last written text so smol</p>
            </div>

        </div>
    )
}

const Friends = () => {

    const session = useSession()
    const socket = useSocket()
    const [Friends,setFriends] = useState([])
    const [load,setLoad] = useState(false)

    useEffect(() => {
        socket?.off("resFriends")
        socket?.on("resFriends",({Friends}) => {
            setFriends(Friends)
        })
        if (!load && session.status == "authenticated"){
            console.log("fetching friends")
            socket.emit("reqFriends",{userId:session.data.id})
            setLoad(true)
        }
    },[load,session,socket])

    return(
        <div className="flex-grow flex flex-col gap-1 overflow-y-scroll">
            {Friends.map((friend,key) => <FriendBox friend={friend} key={key}/>)}
            {Friends.length == 0 && <p className="opacity-50 w-full text-center">Lonely ahh mf</p>}
            
        </div>
    )
}
export default Friends
