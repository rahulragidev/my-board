import React from "react";
import { motion } from "framer-motion";

const Square = ({ children, position, onClick, onDragOver, onDrop }) => {
  // Calculate if the square is black or white based on its position
  const isBlackSquare = () => {
    if (!position) {
      return false; // or handle this scenario appropriately
    }

    const file = position.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(position[1], 10) - 1;

    return (file + rank) % 2 === 1;
  };

  const bgColor = isBlackSquare() ? "bg-green-800" : "bg-gray-200";

  return (
    <motion.div
      className={`w-full aspect-square ${bgColor} flex justify-center items-center aspect-square`}
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()} // Allow dropping
      onDrop={() => onDrop(position)} // Use onDrop prop here
      layout
    >
      {children}
    </motion.div>
  );
};

export default Square;
