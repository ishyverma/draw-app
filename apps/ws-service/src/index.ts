import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

const users: User[] = []

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token ?? "", JWT_SECRET as string) as { userId: string }
        if(!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch(e) {
        return null;
    }
} 

wss.on('connection', (ws, req) => {
    let url = req.url

    if (!url) {
        return;
    }

    const params = new URLSearchParams(url.split("?")[1]);
    const token = params.get("token") || ""

    const userId = checkUser(token)

    if(!userId) {
        ws.close();
        return;
    }

    users.push({
        ws,
        userId,
        rooms: []
    })

    ws.on('message', (data) => {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === "join_room") {
            const user = users.find(u => u.ws === ws)
            if(!user) {
                return;
            }
            user.rooms.push(parsedData.roomId);
        }

        else if (parsedData.type === "leave_room") {
            const user = users.find(u => u.ws === ws) 
            if(!user) {
                return;
            }
            user.rooms = user.rooms.filter(r => r !== parsedData.roomId);
        }

        else if (parsedData.type === "chat") {
            const roomId = parsedData.roomId
            const message = parsedData.message

            const user = users.filter(u => u.ws === ws);
            if(!user) {
                return;
            }

            users.forEach(user => {
                if(user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message,
                        roomId
                    }))
                }
            })

        }
    })
})

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}