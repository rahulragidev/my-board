import React from "react";
import { motion } from "framer-motion";
import Board from "@/components/Board";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-wrap items-center justify-center w-screen h-screen bg-gray-800 text-gray-200 overflow-x-auto overflow-y-auto"
    >
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Board />
      </motion.div>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gray-600 font-extrabold text-xs md:text-sm"
      >
        Created by Rahul Ragi
      </motion.p>
    </motion.div>
  );
}
