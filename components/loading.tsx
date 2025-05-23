import { Loader2 } from "lucide-react";

export default function Loading() {
    return <div className="fixed flex justify-center items-center h-screen w-screen"><Loader2 className="w-12 h-12 animate-spin" /></div>
}