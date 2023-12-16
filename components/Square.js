import { forwardRef, memo, useMemo } from "react";
import { motion } from "framer-motion";

const Square = memo(
  forwardRef(
    (
      {
        children,
        position,
        onClick,
        isKingInCheckSquare,
        isPossibleMove,
        containsOpponentPiece,
        isRecentMove,
      },
      ref
    ) => {
      const isBlackSquare = useMemo(() => {
        const file = position.charCodeAt(0) - "a".charCodeAt(0);
        const rank = parseInt(position[1], 10) - 1;
        return (file + rank) % 2 === 1;
      }, [position]);

      let bgColor;
      let possibleMoveIndicator = null;

      if (isKingInCheckSquare) {
        bgColor =
          "bg-gradient-to-r from-yellow-300 via-red-400 to-pink-400 ring-1 ring-red-400/50 shadow-md";
      } else if (isPossibleMove && containsOpponentPiece && !isRecentMove) {
        bgColor = "bg-red-700 shadow-sm"; // Soft red for capture
      } else if (isRecentMove) {
        bgColor = "bg-yellow-100 shadow-sm"; // Soft yellow for recent move
      } else {
        bgColor = isBlackSquare ? "bg-gray-500" : "bg-gray-50";
      }

      // Styling for possible move indicator
      if (isPossibleMove && !containsOpponentPiece) {
        possibleMoveIndicator = (
          <div
            className="absolute w-4 h-4 rounded-full bg-blue-500"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      }

      const hoverEffect =
        "hover:bg-opacity-80 transition duration-300 ease-in-out";

      // Smooth and subtle animation
      const squareAnimation = {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { duration: 0.4, type: "spring" },
      };

      return (
        <motion.div
          ref={ref}
          initial="initial"
          animate="animate"
          exit="exit"
          transition="transition"
          variants={squareAnimation}
          className={`w-full aspect-square ${bgColor} ${hoverEffect} flex justify-center items-center relative`}
          onClick={() => onClick(position)}
        >
          {possibleMoveIndicator}
          {children}
        </motion.div>
      );
    }
  )
);

Square.displayName = "Square";
export default Square;
