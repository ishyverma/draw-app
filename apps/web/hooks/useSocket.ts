import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYzY1YzlkZC1hZGU2LTQ1ZDctOTkxMS0xYzAyZjBkNmZhYmMiLCJpYXQiOjE3MzY4NTk2MTl9.75ziqiw-50jiN0Rl48Tf_5J6PjrFnJ9FasrP3TII90g`);
        ws.onopen = () => {
            setLoading(false)
            setSocket(ws)
        }
    }, [])

    return {
        socket,
        loading
    }
}