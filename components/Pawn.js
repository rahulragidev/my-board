import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Pawn = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      onDragEnd={(event, info) =>
        onDragEnd(color, square, info.point.x, info.point.y)
      }
      className="flex justify-center items-center relative cursor-grab" // Added grab cursor for better UX
    >
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={100}
        height={100}
        layout="fixed"
      />
    </motion.div>
  );
};

export default Pawn;
