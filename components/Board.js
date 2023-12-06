import React, { useState, useEffect } from "react";
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

  const movePiece = (toSquare) => {
    if (selectedSquare && isMoveValid(boardState, selectedSquare, toSquare)) {
      const newBoardState = { ...boardState };
      newBoardState[toSquare] = newBoardState[selectedSquare];
      newBoardState[selectedSquare] = null;
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
      <div
        className={`transition-all duration-300 ease-in-out transform hover:scale-110 ${
          isSelected ? "transform scale-105 shadow-inner animate-pulse" : ""
        }`}
      >
        <PieceComponent
          color={piece.color}
          position={position}
          onSelect={selectSquare}
        />
      </div>
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
      <div
        className={`grid grid-cols-8 gap-0 w-full max-w- ${responsiveBoardSize()} p-4`}
      >
        {squares}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
      {/* Clock for Black Player 
      <div className="md:w-1/6 w-full px-4 py-2 md:py-0 md:px-2 md:order-1">
        <ChessClock
          isActive={turn === "black" && gameStarted}
          time={blackTime}
          setTime={setBlackTime}
        />
      </div>
      */}

      {/* Chessboard */}
      <div className="flex-grow flex justify-center items-center p-4 md:order-2">
        {renderBoard()}
      </div>

      {/* Clock for White Player 
      <div className="md:w-1/6 w-full px-4 py-2 md:py-0 md:px-2 md:order-3">
        <ChessClock
          isActive={turn === "white" && gameStarted}
          time={whiteTime}
          setTime={setWhiteTime}
        />
      </div>
      */}
    </div>
  );
};

export default Board;
