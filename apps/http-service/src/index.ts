import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/prisma";

const app = express();

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const { name, password, username } = parsedData.data

    try {
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password
            }
        })

        res.json({
            userId: user
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
        
        if(user.password != password) {
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
            message: "There was some error"
        })
        return;
    }
}) 

app.get("/room", async (req, res) => {
    
})

app.listen(3001);