import React, {
  useState,
  useRef,
  memo,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import Square from "./Square";
import ChessPiece from "./ChessPiece";
import EmptySquare from "./EmptySquare";
import ChessClock from "./ChessClock";
import { isMoveValid } from "./ChessUtils";
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
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const movePiece = useCallback(
    (fromSquare, toSquare) => {
      console.log("From square : " + fromSquare);
      console.log("To square : " + toSquare);
      if (isMoveValid(boardState, fromSquare, toSquare)) {
        const newBoardState = {
          ...boardState,
          [toSquare]: boardState[fromSquare],
          [fromSquare]: null,
        };
        setBoardState(newBoardState);
        setTurn(turn === "white" ? "black" : "white");
        const movedPiece = boardState[fromSquare]?.type;
        setGameHistory([
          ...gameHistory,
          { from: fromSquare, to: toSquare, piece: movedPiece },
        ]);
      }
    },
    [boardState, turn, gameHistory]
  );

  const selectPiece = useCallback(
    (position) => {
      const clickedPiece = boardState[position];

      // Check if the clicked position has a piece of the current player
      if (clickedPiece && clickedPiece.color === turn) {
        // Select the clicked piece
        setSelectedPiece(position);
        console.log("Piece selected at position: " + position);
      } else if (selectedPiece) {
        // If another piece is already selected, attempt to move it to the clicked position
        movePiece(selectedPiece, position);
        setSelectedPiece(null); // Deselect the piece after attempting the move
      } else {
        console.log("Invalid selection or not your turn");
      }
    },
    [boardState, turn, selectedPiece, movePiece]
  );

  const onSquareClick = useCallback(
    (toSquare) => {
      if (!gameStarted) {
        setGameStarted(true);
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
      }
      console.log("On Square Click :" + toSquare); // Debugging log
      if (selectedPiece) {
        movePiece(selectedPiece, toSquare);
        setSelectedPiece(null);
      } else {
        console.log("No piece selected yet"); // Additional debugging
      }
    },
    [selectedPiece, movePiece]
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
  }, [boardState, onDragEnd, onSquareClick, selectPiece]); // Make sure dependencies are correct

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col lg:flex-row justify-center items-center w-full h-full p-4 gap-4">
        <motion.div
          className="grid grid-cols-8 mt-4 mb-4 bg-gray-800 p-2 rounded-lg shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {boardLayout}
        </motion.div>
        <div className="space-y-2">
          <ChessClock
            isActive={turn === "black" && gameStarted}
            time={blackTime}
            setTime={setBlackTime}
          />
          <GameHistory history={gameHistory} className="lg:w-1/4 w-full" />
          <ChessClock
            isActive={turn === "white" && gameStarted}
            time={whiteTime}
            setTime={setWhiteTime}
          />
        </div>
      </div>
    </Suspense>
  );
};

Board.displayName = "Board";
export default memo(Board);
