import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { debounce } from "lodash"; // Ensure lodash is correctly imported for debounce

const Pawn = memo(({ color, square, onDragEnd }) => {
  // Debounced function to handle the end of a drag event
  const debouncedOnDragEnd = debounce((event, info) => {
    onDragEnd(color, square, info.point.x, info.point.y);
  }, 100); // Debounce time can be adjusted as needed

  return (
    <motion.div
      drag
      dragElastic={1.0} // Adjust for a more natural drag feel
      dragMomentum={false} // Consider turning this off if the drag feels too "floaty"
      onDragEnd={debouncedOnDragEnd}
      className="flex justify-center items-center relative cursor-grab"
      role="img"
      aria-label={`${color} pawn`}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Add drag constraints here
    >
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={100}
        height={100}
        layout="fixed"
        priority // Consider using priority if this is a critical image
      />
    </motion.div>
  );
});

Pawn.displayName = "Pawn";

export default Pawn;
