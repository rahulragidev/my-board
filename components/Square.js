import { forwardRef, memo, useMemo } from "react";
import { motion } from "framer-motion";

const Square = memo(
  forwardRef(({ children, position, onClick, isKingInCheckSquare }, ref) => {
    const isBlackSquare = useMemo(() => {
      const file = position.charCodeAt(0) - "a".charCodeAt(0);
      const rank = parseInt(position[1], 10) - 1;
      return (file + rank) % 2 === 1;
    }, [position]);

    let bgColor;
    if (isKingInCheckSquare) {
      bgColor =
        "bg-gradient-radial from-red-600 via-red-700 to-red-900 animate-pulseFast ring-2 ring-red-500/50 shadow-2xl";
    } else {
      bgColor = isBlackSquare ? "bg-green-700" : "bg-green-50";
    }

    const hoverEffect = "hover:bg-opacity-75 transition duration-300";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`w-full aspect-square ${bgColor} ${hoverEffect} flex justify-center items-center`}
        onClick={() => onClick(position)}
      >
        {children}
      </motion.div>
    );
  })
);

Square.displayName = "Square";
export default Square;
