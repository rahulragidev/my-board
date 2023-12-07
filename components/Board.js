import React, { useState, useEffect, useRef } from "react";
import Square from "./Square";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import EmptySquare from "./EmptySquare";
import ChessClock from "./ChessClock";
import { isMoveValid } from "./ChessUtils";
import { motion } from "framer-motion";

const pieceComponents = {
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  Pawn,
};

const createInitialBoard = () => {
  const ranks = "87654321";
  const files = "abcdefgh";
  const board = {};

  ranks.split("").forEach((rank) => {
    files.split("").forEach((file) => {
      let piece = null;
      const color = rank > "6" ? "black" : "white";
      const square = `${file}${rank}`;

      if (rank === "8" || rank === "1") {
        const order = [
          "Rook",
          "Knight",
          "Bishop",
          "Queen",
          "King",
          "Bishop",
          "Knight",
          "Rook",
        ];
        piece = { type: order[files.indexOf(file)], color };
      } else if (rank === "7" || rank === "2") {
        piece = { type: "Pawn", color };
      }

      board[square] = piece;
    });
  });

  return board;
};
const Board = () => {
  const [boardState, setBoardState] = useState(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [turn, setTurn] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const initialTime = 900;
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);

  const [windowWidth, setWindowWidth] = useState(undefined);
  const [windowHeight, setWindowHeight] = useState(undefined);
  const squareRefs = useRef({});

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowHeight]);

  const selectSquare = (square) => {
    if (!gameStarted) {
      setGameStarted(true);
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }

    const piece = boardState[square];
    if (selectedSquare && selectedSquare !== square) {
      movePiece(square);
      return;
    }

    if (piece && piece.color === turn) {
      setSelectedSquare(square);
    }
  };

  const onDragEnd = (fromSquare, x, y) => {
    const toSquare = Object.keys(squareRefs.current).find((square) => {
      const rect = squareRefs.current[square].getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    });

    if (toSquare && isMoveValid(boardState, fromSquare, toSquare)) {
      movePiece(fromSquare, toSquare);
    }
  };

  const calculateTargetSquare = (x, y) => {
    const boardTopLeftX = 100; // Replace with actual X position of board's top-left corner
    const boardTopLeftY = 100; // Replace with actual Y position of board's top-left corner
    const squareSize = 50; // Replace with actual size of a square in pixels

    const fileIndex = Math.floor((x - boardTopLeftX) / squareSize);
    const rankIndex = Math.floor((y - boardTopLeftY) / squareSize);

    if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) {
      return null; // Return null if the position is outside the board
    }

    const files = "abcdefgh";
    const ranks = "87654321";

    const file = files[fileIndex];
    const rank = ranks[rankIndex];

    return `${file}${rank}`;
  };

  const movePiece = (fromSquare, toSquare) => {
    if (isMoveValid(boardState, fromSquare, toSquare)) {
      const newBoardState = { ...boardState };
      newBoardState[toSquare] = newBoardState[fromSquare];
      newBoardState[fromSquare] = null;
      setBoardState(newBoardState);
      setSelectedSquare(null);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  const renderPiece = (piece, position) => {
    if (!piece) return <EmptySquare />;
    const PieceComponent = pieceComponents[piece.type];
    const isSelected = position === selectedSquare;

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`transition-all duration-300 ease-in-out ${
          isSelected ? "transform scale-105 shadow-inner animate-pulse" : ""
        }`}
      >
        <PieceComponent
          color={piece.color}
          square={position}
          onDragEnd={onDragEnd} // Make sure this is passed
        />
      </motion.div>
    );
  };

  const renderBoard = () => {
    const ranks = "87654321";
    const files = "abcdefgh";
    const squares = [];

    ranks.split("").forEach((rank) => {
      files.split("").forEach((file) => {
        const square = `${file}${rank}`;
        squares.push(
          <Square
            key={square}
            position={square}
            ref={(el) => (squareRefs.current[square] = el)}
            onClick={() => selectSquare(square)}
          >
            {renderPiece(boardState[square], square)}
          </Square>
        );
      });
    });

    const responsiveBoardSize = () => {
      const isLandscape = windowWidth > windowHeight;

      // Mobile Devices
      if (windowWidth < 600) {
        return isLandscape ? "max-w-lg" : "max-w-md";
      }

      // Tablets
      if (windowWidth < 1024) {
        return isLandscape ? "max-w-lg" : "max-w-md";
      }

      // Laptops and Desktops
      if (windowWidth < 1440) {
        return "max-w-xl";
      }

      return "max-w-3xl";
    };

    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`grid grid-cols-8 gap-0 w-full max-w- ${responsiveBoardSize()} p-4`}
      >
        {squares}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
      {/* Clock for Black Player */}
      <div className="md:w-1/6 w-full px-4 py-2 md:py-0 md:px-2 md:order-1">
        <ChessClock
          isActive={turn === "black" && gameStarted}
          time={blackTime}
          setTime={setBlackTime}
        />
      </div>

      {/* Chessboard */}
      <div className="flex-grow flex justify-center items-center p-4 md:order-2">
        {renderBoard()}
      </div>

      {/* Clock for White Player */}
      <div className="md:w-1/6 w-full px-4 py-2 md:py-0 md:px-2 md:order-3">
        <ChessClock
          isActive={turn === "white" && gameStarted}
          time={whiteTime}
          setTime={setWhiteTime}
        />
      </div>
    </div>
  );
};

export default Board;
