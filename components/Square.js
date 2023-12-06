import React from "react";
import { motion } from "framer-motion";

const Square = ({ children, position, onClick }) => {
  // Calculate if the square is black or white based on its position
  const isBlackSquare = () => {
    const file = position.charCodeAt(0) - "a".charCodeAt(0); // Convert letter to number (a=0, b=1, c=2, ...)
    const rank = parseInt(position[1], 10) - 1; // Convert rank to 0-indexed number

    return (file + rank) % 2 === 1;
  };

  const bgColor = isBlackSquare() ? "bg-green-800" : "bg-gray-200";
  const hoverEffect = "hover:bg-opacity-75 transition duration-300";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`w-full aspect-square ${bgColor} ${hoverEffect} flex justify-center items-center`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Square;
