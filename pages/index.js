import React, { useState } from "react";
import { motion } from "framer-motion";
import Board from "@/components/Board";
import Image from "next/image";

export default function Home() {
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800"
    >
      {!isLogoAnimated && (
        <motion.div
          initial={{ scale: 6, opacity: 0, rotate: 360 }}
          animate={{ scale: 2, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.2, opacity: 0.5, top: 20, left: 20 }}
          transition={{ delay: 0.0, duration: 5.0, type: "spring" }}
          onAnimationComplete={() => setIsLogoAnimated(true)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="rounded-full shadow-md"
          />
        </motion.div>
      )}

      {isLogoAnimated && (
        <>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="w-full"
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
        </>
      )}
    </motion.div>
  );
}
