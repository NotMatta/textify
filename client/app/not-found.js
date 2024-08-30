"use client"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const NotFound = () => {
    const router = useRouter()
    useEffect(() => {router.push("/main/hub")},[router])    
    return(
        <div className="w-full h-full bg-background flex justify-center items-center"><LoaderCircle className="animate-spin repeat-infinite"/></div>
    )
}

export default NotFound
