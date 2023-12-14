import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { debounce } from "lodash"; // Ensure lodash is correctly imported for debounce

const Pawn = memo(({ color, square, onDragEnd }) => {
  const debouncedOnDragEnd = debounce((event, info) => {
    onDragEnd(color, square, info.point.x, info.point.y);
  }, 10);

  return (
    <motion.div
      drag
      dragElastic={1.0}
      dragMomentum={false}
      onDragEnd={debouncedOnDragEnd}
      className="flex justify-center items-center relative cursor-grab"
      role="img"
      aria-label={`${color} pawn`}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      transition={{ duration: 0.1 }} // Quicker transition for dragging
    >
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={100}
        height={100}
        layout="fixed"
        priority
      />
    </motion.div>
  );
});

Pawn.displayName = "Pawn";

export default Pawn;
