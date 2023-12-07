import React, { forwardRef } from "react";
import { motion } from "framer-motion";

const Square = forwardRef(({ children, position, onClick }, ref) => {
  // Function to determine if the square is black or white
  const isBlackSquare = () => {
    const file = position.charCodeAt(0) - "a".charCodeAt(0); // Convert file (letter) to number (a=0, b=1, c=2, ...)
    const rank = parseInt(position[1], 10) - 1; // Convert rank to 0-indexed number
    return (file + rank) % 2 === 1;
  };

  // Determine background color based on square color
  const bgColor = isBlackSquare() ? "bg-green-800" : "bg-gray-200";
  const hoverEffect = "hover:bg-opacity-75 transition duration-300";

  // Return the square component
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`w-full aspect-square ${bgColor} ${hoverEffect} flex justify-center items-center`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
});

export default Square;
