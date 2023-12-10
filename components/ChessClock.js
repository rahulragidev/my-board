import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ChessClock = ({ isActive, time, setTime }) => {
  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time, setTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg p-2 md:p-4 shadow-lg text-lg md:text-2xl lg:text-3xl font-bold border-4 w-32 h-20 ${
        isActive
          ? "text-orange-500 bg-black border-orange-500"
          : "text-gray-100 bg-gray-700 border-gray-700"
      } transition-colors duration-500 ease-in-out transform hover:scale-105`}
    >
      {formatTime(time)}
    </motion.div>
  );
};

export default ChessClock;
