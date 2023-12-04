import Board from "@/components/Board";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-300">
      <h1 className="text-gray-600 text-3xl m-5"> BareBones Chess</h1>
      <Board />
      <h1 className="text-gray-300 text-sm m-5">Made by Rahul Ragi</h1>
    </div>
  );
}
