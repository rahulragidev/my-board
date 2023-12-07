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
  const [turn, setTurn] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const initialTime = 900;
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);

  const squareRefs = useRef({});

  const movePiece = (fromSquare, toSquare) => {
    if (isMoveValid(boardState, fromSquare, toSquare)) {
      const newBoardState = { ...boardState };
      newBoardState[toSquare] = newBoardState[fromSquare];
      newBoardState[fromSquare] = null;
      setBoardState(newBoardState);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  const onDragEnd = (pieceColor, fromSquare, x, y) => {
    if (!gameStarted) {
      setGameStarted(true);
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }

    const toSquare = Object.keys(squareRefs.current).find((square) => {
      const rect = squareRefs.current[square].getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    });
    if (turn === pieceColor) {
      if (toSquare && isMoveValid(boardState, fromSquare, toSquare)) {
        movePiece(fromSquare, toSquare);
      }
    }
  };

  const renderPiece = (piece, position) => {
    if (!piece) return <EmptySquare />;
    const PieceComponent = pieceComponents[piece.type];

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="transition-all duration-300 ease-in-out"
      >
        <PieceComponent
          color={piece.color}
          square={position}
          onDragEnd={onDragEnd}
        />
      </motion.div>
    );
  };

  const renderBoard = () => {
    const ranks = "87654321";
    const files = "abcdefgh";
    const squares = [];

    ranks.split("").forEach((rank, rankIndex) => {
      files.split("").forEach((file, fileIndex) => {
        const isDarkSquare = (rankIndex + fileIndex) % 2 === 1;
        const square = `${file}${rank}`;
        squares.push(
          <Square
            key={square}
            position={square}
            isDarkSquare={isDarkSquare}
            ref={(el) => (squareRefs.current[square] = el)}
          >
            {renderPiece(boardState[square], square)}
          </Square>
        );
      });
    });

    return <div className="grid grid-cols-8">{squares}</div>;
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
      <div className="md:w-1/6 w-full px-4 py-2 md:py-0 md:px-2 md:order-1">
        <ChessClock
          isActive={turn === "black" && gameStarted}
          time={blackTime}
          setTime={setBlackTime}
        />
      </div>

      <div className="flex-grow flex justify-center items-center p-4 md:order-2">
        {renderBoard()}
      </div>

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
