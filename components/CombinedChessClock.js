import React, { useEffect } from "react";
import { motion } from "framer-motion";

const CombinedChessClock = ({
  gameStarted,
  whiteTime,
  blackTime,
  turn,
  setWhiteTime,
  setBlackTime,
}) => {
  useEffect(() => {
    let interval;

    if (gameStarted) {
      interval = setInterval(() => {
        if (turn === "white" && whiteTime > 0) {
          setWhiteTime((time) => time - 1);
        } else if (turn === "black" && blackTime > 0) {
          setBlackTime((time) => time - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, whiteTime, blackTime, turn, setWhiteTime, setBlackTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const timerVariants = {
    active: { scale: 1.1, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)" },
    inactive: { scale: 1, boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex justify-between items-center w-full p-6 bg-white rounded-xl shadow-xl border-2 border-gray-200"
    >
      <motion.div
        className={`flex flex-col items-center justify-center p-4 rounded-lg w-full ${
          turn === "white" ? "bg-black text-white" : "bg-gray-200 text-black"
        }`}
        variants={timerVariants}
        animate={turn === "white" ? "active" : "inactive"}
      >
        <span className="text-sm md:text-base font-medium">White</span>
        <span className="text-lg md:text-2xl font-bold">
          {formatTime(whiteTime)}
        </span>
      </motion.div>
      <motion.div
        className={`flex flex-col items-center justify-center p-4 rounded-lg w-full ${
          turn === "black" ? "bg-black text-white" : "bg-gray-200 text-black"
        }`}
        variants={timerVariants}
        animate={turn === "black" ? "active" : "inactive"}
      >
        <span className="text-sm md:text-base font-medium">Black</span>
        <span className="text-lg md:text-2xl font-bold">
          {formatTime(blackTime)}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default CombinedChessClock;
