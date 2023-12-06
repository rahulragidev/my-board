import React from "react";
import Image from "next/image"; // Keep the import from next/image
import { motion } from "framer-motion";

const Pawn = ({ color, square }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center"
    >
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={100} // Adjust the width as needed
        height={100} // Adjust the height as needed
        layout="fixed" // Choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </motion.div>
  );
};

export default Pawn;
