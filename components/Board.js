import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  Suspense,
  memo,
  useEffect,
} from "react";
import Square from "./Square";
import ChessPiece from "./ChessPiece";
import EmptySquare from "./EmptySquare";
import CombinedChessClock from "./CombinedChessClock";
import {
  isKingInCheck,
  isMoveValid,
  isCheckmate,
  findKingPosition,
} from "../utils/ChessUtils";
import { motion } from "framer-motion";
import GameHistory from "./GameHistory";
import GameOver from "./GameOver";

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

const loadGameFromLocalStorage = () => {
  const savedGame = localStorage.getItem("chessGameState");
  return savedGame ? JSON.parse(savedGame) : null;
};

const saveGameToLocalStorage = (gameState) => {
  localStorage.setItem("chessGameState", JSON.stringify(gameState));
};

const initialTime = 900;
const defaultGameState = {
  boardState: createInitialBoard(),
  turn: "white",
  gameStarted: false,
  whiteTime: initialTime,
  blackTime: initialTime,
  gameHistory: [],
};

const Board = () => {
  const loadedGameState = loadGameFromLocalStorage() || defaultGameState;

  const [boardState, setBoardState] = useState(loadedGameState.boardState);
  const [turn, setTurn] = useState(loadedGameState.turn);
  const [gameStarted, setGameStarted] = useState(loadedGameState.gameStarted);
  const [whiteTime, setWhiteTime] = useState(loadedGameState.whiteTime);
  const [blackTime, setBlackTime] = useState(loadedGameState.blackTime);
  const [gameHistory, setGameHistory] = useState(loadedGameState.gameHistory);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const squareRefs = useRef({});
  const [isInCheck, setIsInCheck] = useState(false);
  const [checkMate, setCheckMate] = useState(false);

  useEffect(() => {
    saveGameToLocalStorage({
      boardState,
      turn,
      gameStarted,
      whiteTime,
      blackTime,
      gameHistory,
    });

    const currentCheckState = isKingInCheck(boardState, turn);
    setIsInCheck(currentCheckState);
    const opponentColor = turn === "white" ? "black" : "white";
    setCheckMate(isCheckmate(boardState, opponentColor));
  }, [boardState, turn, gameStarted, whiteTime, blackTime, gameHistory]);

  const resetGame = () => {
    setBoardState(createInitialBoard());
    setTurn("white");
    setGameStarted(false);
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    setGameHistory([]);
    setSelectedPiece(null);
    setCheckMate(false);
    setIsInCheck(false);
    // Add other state resets if necessary
  };

  const playErrorSound = () => {
    new Audio("/sounds/illegal.mp3").play();
  };

  const playMoveSound = () => {
    new Audio("/sounds/move-self.mp3").play();
  };

  const movePiece = useCallback(
    (fromSquare, toSquare) => {
      const movingPiece = boardState[fromSquare];

      if (isMoveValid(boardState, fromSquare, toSquare)) {
        playMoveSound();

        // Prepare the new board state
        const newBoardState = {
          ...boardState,
          [toSquare]: { ...movingPiece, hasMoved: true }, // Mark the piece as having moved
          [fromSquare]: null,
        };

        // Handle castling move
        if (
          movingPiece.type === "King" &&
          Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0)) === 2
        ) {
          const isKingSide = toSquare === "g1" || toSquare === "g8";
          const rookFromFile = isKingSide ? "h" : "a";
          const rookToFile = isKingSide ? "f" : "d";
          const rank = fromSquare[1];

          // Move the rook in the case of castling
          newBoardState[`${rookToFile}${rank}`] = {
            ...newBoardState[`${rookFromFile}${rank}`],
            hasMoved: true,
          };
          newBoardState[`${rookFromFile}${rank}`] = null;
        }

        // Update board state, turn, and game history
        setBoardState(newBoardState);
        setTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
        const movedPiece = boardState[fromSquare]?.type;
        setGameHistory((prevHistory) => [
          ...prevHistory,
          { from: fromSquare, to: toSquare, piece: movedPiece },
        ]);
      } else {
        playErrorSound();
      }
    },
    [boardState, playMoveSound, playErrorSound, setGameHistory, setTurn]
  );

  const selectPiece = useCallback(
    (position) => {
      const clickedPiece = boardState[position];
      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedPiece(position);
      } else if (selectedPiece) {
        movePiece(selectedPiece, position);
        setSelectedPiece(null);
      }
    },
    [boardState, turn, selectedPiece, movePiece]
  );

  const onSquareClick = useCallback(
    (toSquare) => {
      if (!gameStarted) {
        setGameStarted(true);
      }
      if (selectedPiece) {
        movePiece(selectedPiece, toSquare);
        setSelectedPiece(null);
      }
    },
    [gameStarted, selectedPiece, movePiece]
  );

  const onDragEnd = useCallback(
    (pieceColor, fromSquare, x, y) => {
      if (turn !== pieceColor) return;
      if (!gameStarted) {
        setGameStarted(true);
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
      }

      const closestSquare = Object.keys(squareRefs.current).reduce(
        (closest, square) => {
          const rect = squareRefs.current[square].getBoundingClientRect();
          const squareCenterX = rect.left + rect.width / 2;
          const squareCenterY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(x - squareCenterX, 2) + Math.pow(y - squareCenterY, 2)
          );

          if (!closest || distance < closest.distance) {
            return { square, distance };
          }

          return closest;
        },
        null
      );

      if (closestSquare) {
        movePiece(fromSquare, closestSquare.square);
      }
    },
    [turn, gameStarted, movePiece]
  );

  const boardLayout = useMemo(() => {
    const ranks = "87654321";
    const files = "abcdefgh";
    const kingPosition = isInCheck ? findKingPosition(boardState, turn) : null;
    return ranks.split("").flatMap((rank, rankIndex) =>
      files.split("").map((file, fileIndex) => {
        const isDarkSquare = (rankIndex + fileIndex) % 2 === 1;
        const square = `${file}${rank}`; // This is the position of each square
        const piece = boardState[square];
        return (
          <Square
            key={square}
            position={square}
            isDarkSquare={isDarkSquare}
            ref={(el) => (squareRefs.current[square] = el)}
            onClick={() => onSquareClick(square)}
            isKingInCheckSquare={square === kingPosition}
          >
            {piece ? (
              <ChessPiece
                type={piece.type}
                color={piece.color}
                position={square}
                onDragEnd={onDragEnd}
                selectPiece={selectPiece}
              />
            ) : (
              <EmptySquare />
            )}
          </Square>
        );
      })
    );
  }, [boardState, onDragEnd, onSquareClick, selectPiece]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {checkMate && <GameOver onNewGame={resetGame} />}
      <div className="flex flex-col lg:flex-row justify-center items-center w-full h-full p-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-1 px-2 rounded absolute top-2 right-2"
          title="New Game"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>{" "}
            {/* This is a sample icon for a reset symbol */}
          </svg>
        </motion.button>
        <motion.div
          className="grid grid-cols-8 mt-4 mb-4 bg-gray-100 p-2 rounded-lg shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {boardLayout}
        </motion.div>
        <div className="space-y-2 w-full md:w-1/4">
          <CombinedChessClock
            gameStarted={gameStarted}
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            setWhiteTime={setWhiteTime}
            setBlackTime={setBlackTime}
          />
          <div className="overflow-y-auto h-32 lg:h-64">
            <GameHistory history={gameHistory} className="lg:w-1/4 w-full" />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default memo(Board);
