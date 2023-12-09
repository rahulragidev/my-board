import React, {
  useState,
  useRef,
  memo,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import Square from "./Square";
import Rook from "./Rook"; // Consider using lazy loading if these components are heavy
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import EmptySquare from "./EmptySquare";
import ChessClock from "./ChessClock";
import { isMoveValid } from "./ChessUtils";
import { motion } from "framer-motion";

// Memoized component for chess pieces
const ChessPiece = memo(({ type, color, position, onDragEnd }) => {
  const PieceComponent = { Rook, Knight, Bishop, Queen, King, Pawn }[type];
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="transition-all duration-300 ease-in-out"
    >
      <PieceComponent color={color} square={position} onDragEnd={onDragEnd} />
    </motion.div>
  );
});

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

  const movePiece = useCallback(
    (fromSquare, toSquare) => {
      if (isMoveValid(boardState, fromSquare, toSquare)) {
        const newBoardState = {
          ...boardState,
          [toSquare]: boardState[fromSquare],
          [fromSquare]: null,
        };
        setBoardState(newBoardState);
        setTurn(turn === "white" ? "black" : "white");
      }
    },
    [boardState, turn]
  );

  const onDragEnd = useCallback(
    (pieceColor, fromSquare, x, y) => {
      if (turn !== pieceColor) return;
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

      if (toSquare) {
        movePiece(fromSquare, toSquare);
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
        const square = `${file}${rank}`;
        const piece = boardState[square];
        return (
          <Square
            key={square}
            position={square}
            isDarkSquare={isDarkSquare}
            ref={(el) => (squareRefs.current[square] = el)}
          >
            {piece ? (
              <ChessPiece
                type={piece.type}
                color={piece.color}
                position={square}
                onDragEnd={onDragEnd}
              />
            ) : (
              <EmptySquare />
            )}
          </Square>
        );
      })
    );
  }, [boardState, onDragEnd]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
        <ChessClock
          isActive={turn === "black" && gameStarted}
          time={blackTime}
          setTime={setBlackTime}
        />
        <div className="grid grid-cols-8">{boardLayout}</div>
        <ChessClock
          isActive={turn === "white" && gameStarted}
          time={whiteTime}
          setTime={setWhiteTime}
        />
      </div>
    </Suspense>
  );
};

export default memo(Board);
