import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const King = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      whileDrag={{ scale: 1.2, zIndex: 100 }} // Scale up and increase z-index while dragging
      onDragEnd={(event, info) => onDragEnd(square, info.point.x, info.point.y)} // Handle the drag end event
      className="flex justify-center items-center"
    >
      <Image
        src={`/images/king-${color}.svg`}
        alt={`${color} king`}
        width={100} // Width of the king image
        height={100} // Height of the king image
        layout="fixed" // Image layout
      />
    </motion.div>
  );
};

export default King;
