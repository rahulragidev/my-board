import { memo } from "react";
import Rook from "./Rook"; // Consider using lazy loading if these components are heavy
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import { motion } from "framer-motion";

const ChessPiece = memo(({ type, color, position, onDragEnd, selectPiece }) => {
  const PieceComponent = { Rook, Knight, Bishop, Queen, King, Pawn }[type];

  // Added event propagation handling
  const handleClick = (e) => {
    e.stopPropagation();
    selectPiece(position);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="transition-all duration-300 ease-in-out"
      onClick={handleClick}
    >
      <PieceComponent color={color} square={position} onDragEnd={onDragEnd} />
    </motion.div>
  );
});

ChessPiece.displayName = "ChessPiece";

export default ChessPiece;
