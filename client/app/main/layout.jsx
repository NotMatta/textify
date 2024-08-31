import AddFriendForm from "@/components/addfriend-form"
import FriendRequests from "@/components/friendrequest-list"
import Friends from "@/components/friends"
import { Input } from "@/components/ui/input"
import { Search,CopyPlus, Circle, Send } from "lucide-react"

const Layout = ({children}) => {
    return (
        <div className="w-full h-full flex">
            <div className="w-64 hidden md:flex flex-col border-r p-2 gap-1 relative">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Textify</h1>
                    <div className="flex gap-1">
                        <AddFriendForm/>
                        <button className="bg-border rounded-full size-8 flex items-center justify-center">
                            <CopyPlus/>
                        </button>
                        <FriendRequests/>

                    </div>
                </div>
                <div className="flex items-center bg-border rounded-xl px-2">
                    <Search/>
                    <Input className="border-none bg-transparent" placeholder="Search Friends"/>
                </div>
                <Friends/>
                <div className="border-t w-full min-h-16 flex items-center gap-1">
                    <img className="rounded-full size-12 object-fit" src="https://i.pinimg.com/originals/9d/1c/5f/9d1c5ff00cf4a679e9a80c29ee6cf6e6.jpg"/>
                    <div className="flex flex-col text-sm">
                        <p className="font-bold">Matta</p>
                        <p className="opacity-50 flex items-center gap-1">
                            <Circle className="text-green-700 size-3 bg-green-700 rounded-full"/>Online
                        </p>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}

export default Layout
