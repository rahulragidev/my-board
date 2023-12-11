import React from "react";
import { motion } from "framer-motion";

const GameHistory = ({ history }) => {
  // Convert move data to standard chess notation
  const toChessNotation = (move) => {
    let notation = "";
    const pieceNotation =
      move.piece === "Pawn" ? "" : move.piece[0].toUpperCase();
    const captureNotation = move.capture ? "x" : "";
    notation += pieceNotation + captureNotation + move.to;

    // Handle special moves like castling, check, or checkmate
    // Example: if (move.isCheck) { notation += '+'; }

    return notation;
  };

  // Function to format the history into move pairs (white followed by black)
  const formatHistory = () => {
    const formattedHistory = [];
    for (let i = 0; i < history.length; i += 2) {
      const whiteMove = history[i] ? toChessNotation(history[i]) : "";
      const blackMove = history[i + 1] ? toChessNotation(history[i + 1]) : "";
      formattedHistory.push({
        moveNumber: Math.floor(i / 2) + 1,
        whiteMove,
        blackMove,
      });
    }
    return formattedHistory;
  };
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="game-history w-96 h-96 mx-auto mt-2 p-1 rounded-lg shadow-lg overflow-y-scroll bg-gray-100"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <ul className="list-none space-y-1">
        {formatHistory().map(({ moveNumber, whiteMove, blackMove }, index) => (
          <motion.li
            key={moveNumber}
            className={`flex items-center justify-between px-2 py-1 rounded ${
              index === history.length / 2 - 1 ? "bg-green-700" : ""
            }`}
            variants={listItemVariants}
          >
            <div className="flex-1 flex items-center space-x-2">
              <span className="font-semibold">{moveNumber}.</span>
              <div className="w-full bg-gray-100 p-2 rounded">
                <span
                  className={`font-medium ${
                    whiteMove ? "text-black" : "text-gray-400"
                  }`}
                >
                  {whiteMove || "..."}
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="w-full bg-gray-200 p-2 rounded">
                <span
                  className={`font-medium ${
                    blackMove ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {blackMove || "..."}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default GameHistory;
