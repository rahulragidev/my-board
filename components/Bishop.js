import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Bishop = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      // Adjust these properties as per your requirements
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      onDragEnd={(event, info) => onDragEnd(square, info.point.x, info.point.y)}
      className="flex justify-center items-center"
    >
      <Image
        src={`/images/bishop-${color}.svg`}
        alt={`${color} bishop`}
        width={100} // Set the width as needed
        height={100} // Set the height as needed
        layout="fixed" // Choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </motion.div>
  );
};

export default Bishop;
