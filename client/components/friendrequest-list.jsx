"use client"
import { AlertDialog, AlertDialogTitle, AlertDialogAction,AlertDialogFooter, AlertDialogCancel, AlertDialogDescription, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import { useEffect, useState } from "react"
import { useSocket } from "./socket-provider"
import { useSession } from "./session-provider"
import { Description } from "@radix-ui/react-alert-dialog"

const FriendRequests = () => {

    const [Requests,setRequests] = useState([])
    const [load,setLoading] = useState(false)
    const socket = useSocket()
    const session = useSession()

    useEffect(() => {
        socket?.off("resFriendRequests")
        socket?.on("resFriendRequests",({Requests}) => {
            console.log("Friends Updated")
            setRequests(Requests)
        })

        if (!load && socket && session.status == "authenticated"){
            socket.emit("getFriendRequests",{userId:session.data.id})
            setLoading(false)
        }
    },[load,socket,session])

    const FriendRequest = ({request}) => {
        const AcceptRequest = () => {
            socket.emit("acceptRequest",{userId: session.data.id ,requestId: request.id})
        }
        const RejectRequest = () => {
            socket.emit("rejectRequest",{userId: session.data.id ,requestId: request.id})
        }
        return(
            <div className="w-full border h-20 rounded-xl shrink-0 flex items-center gap-2 px-2">
                <img src={request.User1.pfp}
                    className="w-16 h-16 object-cover rounded-full"/>
                <p className="w-full">{request.User1.username}</p>
                <Button onClick={AcceptRequest}>Accept</Button>
                <Button onClick={RejectRequest} variant="outline" className="text-red-500 border-red-500">Reject</Button>
            </div>
            
        )
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger className="relative bg-border rounded-full size-8 flex items-center justify-center">
                <Send/>
                <p
                    className={`absolute ${Requests.length == 0 ? "hidden": ""} bg-red-600 rounded-full p-1 scale-50 font-bold -top-3 -left-3 text-md w-7 h-7 flex items-center justify-center`}>
                    {Requests.length > 10 ? "+9" : Requests.length}
                </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Friend Requests</AlertDialogTitle>
                    <AlertDialogDescription/>
                    <div className="h-screen max-h-72 overflow-y-scroll flex flex-col gap-2 px-2 ">
                        {Requests.map((request,key) => <FriendRequest key={key} request={request}/>)}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default FriendRequests
