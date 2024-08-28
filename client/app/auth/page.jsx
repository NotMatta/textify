"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User , Key} from "lucide-react"
import { AlertDialog, AlertDialogTitle, AlertDialogAction,AlertDialogFooter , AlertDialogDescription, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { useSocket } from "@/components/socket-provider"

const LoginPage = () => {
    const socket = useSocket()
    const [load,setLoading] =  useState(false)
    const HandleSubmit = (formEvent) => {
        formEvent.preventDefault()
        const formData = new FormData(formEvent.target)
        socket.emit("login",{userName:formData.get("username"),password:formData.get("password")})
    }

    useEffect(() => {
        socket?.on("auth",(data) => {
            console.log(data)
        })
    },[socket])

    return (
        <div className="flex w-full h-full justify-center items-center">
            <form className="border px-2 py-4 w-4/5 max-w-96 flex flex-col items-center rounded-2xl gap-2" onSubmit={HandleSubmit}>
                <h1 className="text-5xl font-extrabold">Login</h1>
                <div className="flex gap-1 px-1 items-center border w-full rounded-xl overflow-hidden">
                    <User/>
                    <Input placeholder="Username here" className="border-none" required name="username"/>
                </div>
                <div className="flex gap-1 px-1 items-center border w-full rounded-xl overflow-hidden">
                    <Key/>
                    <Input placeholder="Password here" className="border-none" type="password" required name="password"/>
                </div>
                <Button className="w-full" type="submit">Sign in</Button>
                <AlertDialog>
                    <AlertDialogTrigger className="opacity-50 text-xm">Don&apos;t have an account?</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Account Creation:</AlertDialogTitle>
                            <AlertDialogDescription>type an unregistered username with a well made password and we will make you one who needs to create an account anyway</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Got it!</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </form>
        </div>
    )
}

export default LoginPage
