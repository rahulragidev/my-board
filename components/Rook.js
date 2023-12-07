import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Rook = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      // You may adjust these properties based on your requirements
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      onDragEnd={(event, info) => onDragEnd(square, info.point.x, info.point.y)}
      className="flex justify-center items-center"
    >
      <Image
        src={`/images/rook-${color}.svg`}
        alt={`${color} rook`}
        width={100} // Set the width as needed
        height={100} // Set the height as needed
        layout="fixed" // You can choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </motion.div>
  );
};

export default Rook;
