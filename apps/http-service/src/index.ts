import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/prisma";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const { name, password, username } = parsedData.data
    const hashedPassword = await bcrypt.hash(password, 5);
    try {
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        })

        res.json({
            userId: user.id
        })
        return;

    } catch(e) {
        res.status(404).json({
            message: "Username was taken"
        })
        return
    }

})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }
    const { username, password } = parsedData.data
    try {
        const user = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if(!user) {
            res.status(404).json({
                message: "There is no user with this username"
            })
            return
        }

        const hashedPassword = await bcrypt.compare(password, user.password)

        if(!hashedPassword) {
            res.status(404).json({
                message: "Password is incorrect"
            })
            return
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET as string)

        res.json({
            token
        })
        return;
    } catch(e) {
        res.status(404).json({
            message: "User not exists"
        })
        return;
    }
})

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }
    const { name } = parsedData.data

    try {
        const room = await prisma.room.create({
            data: { 
                slug: name,
                adminId: req.userId
            }
        })

        res.json({
            roomId: room.id
        })
        return;
    } catch(e) {
        res.status(404).json({
            message: "Room already exists"
        })
        return;
    }
}) 

app.get("/chats/:roomId", async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await prisma.chat.findMany({
            where: {
                roomId: Number(roomId)
            },
            take: 50,
            orderBy: {
                id: "desc"
            }   
        })
        res.json({
            messages
        })
        return
    } catch(e) {
        res.status(404).json({
            message: "There was some error"
        })
        return
    }
})

app.get("/room/:slug", async (req, res) => {
    const { slug } = req.params;
    const room = await prisma.room.findFirst({
        where: {
            slug
        },
        select: {
            id: true
        }
    })
    res.json({
        room
    })
})

app.listen(3001);