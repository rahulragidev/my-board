import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const King = ({ color, square, onDragEnd }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(event, info) =>
        onDragEnd(color, square, info.point.x, info.point.y)
      }
      className="flex justify-center items-center relative"
    >
      <Image
        src={`/images/king-${color}.svg`}
        alt={`${color} king`}
        width={100}
        height={100}
        layout="fixed"
      />
    </motion.div>
  );
};

export default King;
