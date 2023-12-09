import React, { memo, forwardRef, useMemo } from "react";
import { motion } from "framer-motion";

const Square = memo(
  forwardRef(({ children, position, onClick }, ref) => {
    // Optimized calculation for black square
    const isBlackSquare = useMemo(() => {
      const file = position.charCodeAt(0) - "a".charCodeAt(0);
      const rank = parseInt(position[1], 10) - 1;
      return (file + rank) % 2 === 1;
    }, [position]);

    const bgColor = isBlackSquare ? "bg-green-800" : "bg-gray-200";
    const hoverEffect = "hover:bg-opacity-75 transition duration-300";

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
  })
);

Square.displayName = "Square";

export default Square;
