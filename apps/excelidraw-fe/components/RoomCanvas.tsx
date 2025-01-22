"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: {
    roomId: string;
}) {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNDAyMGYzMy1hY2ZmLTRhNjAtYjc2OC05NmE3NDAxZDEwMzQiLCJpYXQiOjE3Mzc1NTQ5NzJ9.g-gJHY2ZsBwY-MF2XQs2NHKfW7s31W7r0VchtSYJIPQ`)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    }, [])  

    if(!socket) {
        return <div>
            Connecting to the server...
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}