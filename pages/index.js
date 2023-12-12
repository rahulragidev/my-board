import React from "react";
import { motion } from "framer-motion";
import Board from "@/components/Board";
import Image from "next/image";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full shadow-md mt-4"
        />
      </motion.div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="w-full px-2"
      >
        <Board />
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="text-gray-500 font-medium mt-5 text-sm"
      >
        Created by Rahul Ragi
      </motion.p>
    </motion.div>
  );
}
