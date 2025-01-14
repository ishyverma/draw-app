import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
    let url = req.url

    if (!url) {
        return;
    }

    const params = new URLSearchParams(url.split("?")[1]);
    const token = params.get("token")
    const decoded = jwt.verify(token ?? "", JWT_SECRET as string) as { userId: number }

    if(!decoded || !decoded.userId) {
        ws.close();
        return;
    }

    ws.on('message', (data) => {
        ws.send('pong');
    })
})
