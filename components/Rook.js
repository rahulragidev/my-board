import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Rook = ({ color, onDragStart, onDragEnd }) => {
  return (
    <motion.div
      drag
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className="cursor-grab"
    >
      <Image
        src={`/images/rook-${color}.svg`}
        alt={`${color} rook`}
        width={80}
        height={80}
        layout="fixed"
      />
    </motion.div>
  );
};

export default Rook;
