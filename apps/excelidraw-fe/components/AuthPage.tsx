"use client";

import { useState } from "react";

export function AuthPage({ isSignIn }: {
    isSignIn: boolean;
}) {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded">
            <div className="p-2">
                <input type="text" placeholder="username" />
            </div>
            <div className="p-2">
                <input type="password" placeholder="password" />
            </div>
            <div>
                <input type="text" />
            </div>
            <div className="pt-2">
                <button onClick={() => {

                }}>{isSignIn ? "Signin" : "Signup"}</button>
            </div>
        </div>
    </div>
}