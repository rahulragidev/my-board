import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  Suspense,
  memo,
} from "react";
import Square from "./Square";
import ChessPiece from "./ChessPiece";
import EmptySquare from "./EmptySquare";
import CombinedChessClock from "./CombinedChessClock";
import { isMoveValid } from "../utils/ChessUtils";
import { motion } from "framer-motion";
import GameHistory from "./GameHistory";

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
          "Night",
          "Bishop",
          "Queen",
          "King",
          "Bishop",
          "Night",
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
  const initialTime = 900; // 15 minutes in seconds
  const [boardState, setBoardState] = useState(createInitialBoard());
  const [turn, setTurn] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const squareRefs = useRef({});

  const playErrorSound = () => {
    new Audio("/sounds/illegal.mp3").play();
  };

  const playMoveSound = () => {
    new Audio("/sounds/move-self.mp3").play();
  };

  const movePiece = useCallback(
    (fromSquare, toSquare) => {
      if (isMoveValid(boardState, fromSquare, toSquare)) {
        playMoveSound();
        const newBoardState = {
          ...boardState,
          [toSquare]: boardState[fromSquare],
          [fromSquare]: null,
        };
        setBoardState(newBoardState);
        setTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
        const movedPiece = boardState[fromSquare]?.type;
        setGameHistory((prevHistory) => [
          ...prevHistory,
          { from: fromSquare, to: toSquare, piece: movedPiece },
        ]);
      } else if (!isMoveValid) {
        playErrorSound();
      }
    },
    [boardState]
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
      <div className="flex flex-col lg:flex-row justify-center items-center w-full h-full p-2 gap-4">
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
