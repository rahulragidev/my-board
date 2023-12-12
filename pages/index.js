import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Board from "@/components/Board";
import Image from "next/image";

export default function Home() {
  const [animateLogo, setAnimateLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateLogo(false);
    }, 1500); // Duration after which the logo will move to the corner
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800"
    >
      <motion.div
        initial={{ scale: 6, opacity: 0, rotate: 360 }}
        animate={{ scale: 2, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.3, opacity: 0.5, top: 20, left: 20 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${
          animateLogo ? "" : "hidden"
        }`} // Reduced opacity and positioning for the logo after animation
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="rounded-full shadow-md"
        />
      </motion.div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="w-full px-2 mt-16"
      >
        <Board />
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.7 }}
        className="text-gray-500 font-medium mt-5 text-sm"
      >
        Created by Rahul Ragi
      </motion.p>
    </motion.div>
  );
}
