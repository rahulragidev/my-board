import { memo, lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Lazy loading piece components
const Rook = lazy(() => import("./Rook"));
const Knight = lazy(() => import("./Knight"));
const Bishop = lazy(() => import("./Bishop"));
const Queen = lazy(() => import("./Queen"));
const King = lazy(() => import("./King"));
const Pawn = lazy(() => import("./Pawn"));

const ChessPiece = memo(({ type, color, position, onDragEnd, selectPiece }) => {
  const PieceComponent = { Rook, Knight, Bishop, Queen, King, Pawn }[type];

  const handleClick = (e) => {
    e.stopPropagation();
    selectPiece(position);
  };

  return (
    <Suspense fallback={<div></div>}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }} // Added for immediate click feedback
        className="transition-all duration-100 ease-in-out" // Reduced duration for quicker transition
        onClick={handleClick}
      >
        <PieceComponent color={color} square={position} onDragEnd={onDragEnd} />
      </motion.div>
    </Suspense>
  );
});

ChessPiece.displayName = "ChessPiece";

export default ChessPiece;
