import { NextRequest, NextResponse } from "next/server"
import Cookies from "js-cookie"

const middleware = async (req) => {
    const token = req.cookies.get("token") || null
    const path = (new URL(req.url)).pathname
    if(path == "/auth" && token){
        return NextResponse.redirect(new URL("/main/hub",req.url))
    }
    if(path.startsWith("/main") && !token){
        return NextResponse.redirect(new URL("/auth",req.url))
    }
    return NextResponse.next()
}

export default middleware
