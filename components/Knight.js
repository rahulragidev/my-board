import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { debounce } from "lodash";

const Knight = memo(({ color, square, onDragEnd }) => {
  const debouncedOnDragEnd = debounce((event, info) => {
    onDragEnd(color, square, info.point.x, info.point.y);
  }, 100); // Adjust debounce time as needed

  return (
    <motion.div
      drag
      dragElastic={1.0} // Adjust for a more natural drag feel
      dragMomentum={true} // Consider turning this off if the drag feels too "floaty"
      onDragEnd={debouncedOnDragEnd}
      className="flex justify-center items-center relative cursor-grab"
      role="img"
      aria-label={`${color} knight`}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <Image
        src={`/images/knight-${color}.svg`}
        alt={`${color} knight`}
        width={100}
        height={100}
        layout="fixed"
        priority // Consider using priority if this is a critical image
      />
    </motion.div>
  );
});

Knight.displayName = "Knight";
export default Knight;
