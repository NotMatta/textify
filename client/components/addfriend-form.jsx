"use client"
import { AlertDialog, AlertDialogTitle, AlertDialogAction,AlertDialogFooter , AlertDialogDescription, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader } from "@/components/ui/alert-dialog"
import {  UserRound, UserRoundPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSession } from "./session-provider"
import { useSocket } from "./socket-provider"
import { useToast } from "./ui/use-toast"
import { useState } from "react"
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog"
import { Button } from "./ui/button"

const AddFriendForm = () => {

    const session = useSession()
    const socket = useSocket()
    const {toast} = useToast()
    const [username,setUsername] = useState("")

    const HandleRequest = () => {
        socket.emit("sendRequest",{userId:session.data.id, username})
        setUsername("")
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger className="bg-border rounded-full size-8 flex items-center justify-center">
                <UserRoundPlus/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add a friend</AlertDialogTitle>
                    <AlertDialogDescription className="border flex items-center rounded-xl px-2 text-primary">
                        <UserRound/>
                        <Input value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder="Friend Username.." className="border-none"/>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border border-primary p-2 rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={username == session.data.username} onClick={HandleRequest}>{username == session.data.username ? ":)" : "Got it!"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AddFriendForm
