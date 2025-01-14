"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        gap: 10
      }}
    >
      <input
        style={{
          padding: 10,
        }}
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
        type="text"
        placeholder="Room Id"
      />
      <button
        style={{
          padding: 10,
        }}
        onClick={() => {
          router.push(`/room/${roomId}`);
        }}
      >
        Join Room
      </button>
    </div>
  );
}
