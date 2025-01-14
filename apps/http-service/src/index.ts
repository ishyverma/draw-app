import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/prisma";

const app = express();

app.post("/signup", (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const { name, password, username } = parsedData.data

})

app.post("/signin", (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }

})

app.post("/room", middleware, (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(404).json({
            message: "Incorrect Inputs"
        })
        return;
    }
}) 

app.listen(3001);