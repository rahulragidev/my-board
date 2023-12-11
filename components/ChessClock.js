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
      className={`rounded-lg p-2 md:p-4 shadow-md  w-1/4 text-md md:text-xl lg:text-2xl font-semibold border ${
        isActive
          ? "text-gray-100 bg-green-700 border-green-50"
          : "text-gray-400 bg-green-50 border-green-700"
      } transition-colors duration-500 ease-in-out transform hover:scale-105`}
    >
      {formatTime(time)}
    </motion.div>
  );
};

export default ChessClock;
