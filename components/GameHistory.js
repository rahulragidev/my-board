import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GameHistory = ({ history }) => {
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: historyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

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

  const loadingDotsVariants = {
    animate: {
      opacity: [0, 1, 0],
      transition: { repeat: Infinity, duration: 1.2 },
    },
  };

  return (
    <div className="relative max-w-md mx-auto my-4">
      <motion.div
        ref={historyRef}
        className="game-history relative p-4 rounded-lg shadow-md overflow-y-auto bg-gray-50 border border-gray-200"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        style={{ maxHeight: "300px" }} // Adjust height as needed
      >
        <ul className="space-y-3">
          {formatHistory().map(
            ({ moveNumber, whiteMove, blackMove }, index) => (
              <motion.li
                key={moveNumber}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm"
                variants={listItemVariants}
              >
                <span className="font-semibold text-gray-800">
                  {moveNumber}.
                </span>
                <div className="flex-1 flex justify-between ml-4">
                  <span
                    className={`font-medium ${
                      whiteMove ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {whiteMove || (
                      <motion.span
                        variants={loadingDotsVariants}
                        animate="animate"
                      >
                        ...
                      </motion.span>
                    )}
                  </span>
                  <span
                    className={`font-medium ${
                      blackMove ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {blackMove || (
                      <motion.span
                        variants={loadingDotsVariants}
                        animate="animate"
                      >
                        ...
                      </motion.span>
                    )}
                  </span>
                </div>
              </motion.li>
            )
          )}
        </ul>
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default GameHistory;
