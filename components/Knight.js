import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Knight = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      whileDrag={{ scale: 1.2, zIndex: 100 }} // This will visually elevate the piece during dragging
      onDragEnd={(event, info) => onDragEnd(square, info.point.x, info.point.y)} // Handle the drag end
      className="flex justify-center items-center"
    >
      <Image
        src={`/images/knight-${color}.svg`}
        alt={`${color} knight`}
        width={100} // Width of the knight image
        height={100} // Height of the knight image
        layout="fixed" // Image layout
      />
    </motion.div>
  );
};

export default Knight;
