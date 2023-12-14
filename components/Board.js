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
  createInitialBoard,
} from "../utils/ChessUtils";
import { motion } from "framer-motion";
import GameHistory from "./GameHistory";
import GameOver from "./GameOver";
import PromotionChoice from "./PromotionChoice";

const loadGameFromLocalStorage = () => {
  try {
    const savedGame = localStorage.getItem("chessGameState");
    return savedGame ? JSON.parse(savedGame) : null;
  } catch (error) {
    console.error("Error loading game from local storage:", error);
    return null;
  }
};

const saveGameToLocalStorage = (gameState) => {
  try {
    localStorage.setItem("chessGameState", JSON.stringify(gameState));
  } catch (error) {
    console.error("Error saving game to local storage:", error);
  }
};

const initialTime = 900;
const createDefaultGameState = () => {
  return {
    boardState: createInitialBoard(),
    turn: "white",
    gameStarted: false,
    whiteTime: initialTime,
    blackTime: initialTime,
    gameHistory: [],
  };
};

const defaultGameState = createDefaultGameState();

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
  const [promotion, setPromotion] = useState(null);

  const clearLocalStorageAndCookies = useCallback(() => {
    // Clear local storage
    localStorage.removeItem("chessGameState");

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }, []);

  useEffect(() => {
    // Clear cookies on component mount
    clearLocalStorageAndCookies();

    // Save game state to local storage
    saveGameToLocalStorage({
      boardState,
      turn,
      gameStarted,
      whiteTime,
      blackTime,
      gameHistory,
    });
  }, [
    boardState,
    turn,
    gameStarted,
    whiteTime,
    blackTime,
    gameHistory,
    clearLocalStorageAndCookies,
  ]);

  useEffect(() => {
    // Update check and checkmate state
    const currentCheckState = isKingInCheck(boardState, turn);
    setIsInCheck(currentCheckState);

    const opponentColor = turn === "white" ? "black" : "white";
    setCheckMate(isCheckmate(boardState, opponentColor));
  }, [boardState, turn]);

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
      console.log("Entered into Move Piece : ");
      const movingPiece = boardState[fromSquare];

      if (isMoveValid(boardState, fromSquare, toSquare)) {
        playMoveSound();
        // Prepare the new board state
        const newBoardState = {
          ...boardState,
          [toSquare]: { ...movingPiece, hasMoved: true }, // Mark the piece as having moved
          [fromSquare]: null,
        };

        //pawn promotion

        if (
          movingPiece.type === "Pawn" &&
          (toSquare[1] === "8" || toSquare[1] === "1")
        ) {
          setPromotion({ fromSquare, toSquare, color: movingPiece.color });
          return;
        }

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

  const handlePromotionChoice = useCallback(
    (pieceType) => {
      if (promotion) {
        const { fromSquare, toSquare, color } = promotion;
        setBoardState((prevBoardState) => ({
          ...prevBoardState,
          [toSquare]: { type: pieceType, color },
          [fromSquare]: null,
        }));
        setTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
        // Update game history and other relevant states
        setPromotion(null); // Close the promotion choice UI
      }
    },
    [promotion]
  );

  const selectPiece = useCallback(
    (position) => {
      const clickedPiece = boardState[position];

      // Check if a piece is clicked and if it's the turn of that piece's color
      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedPiece(position);
      } else if (selectedPiece) {
        // If a piece is already selected and a new position is clicked
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
      if (turn !== pieceColor || !gameStarted) {
        if (!gameStarted) {
          setGameStarted(true);
          setWhiteTime(initialTime);
          setBlackTime(initialTime);
        }
        return;
      }

      const closestSquare = findClosestSquare(x, y);
      if (closestSquare) {
        movePiece(fromSquare, closestSquare);
      }
    },
    [turn, gameStarted, movePiece]
  );

  const findClosestSquare = (x, y) => {
    return Object.keys(squareRefs.current).reduce((closest, square) => {
      const rect = squareRefs.current[square].getBoundingClientRect();
      const squareCenterX = rect.left + rect.width / 2;
      const squareCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(x - squareCenterX, y - squareCenterY);

      return !closest || distance < closest.distance
        ? { square, distance }
        : closest;
    }, null)?.square;
  };

  const boardLayout = useMemo(() => {
    const ranks = "87654321";
    const files = "abcdefgh";
    let kingPosition = null;

    if (isInCheck) {
      kingPosition = findKingPosition(boardState, turn);
    }

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
  }, [boardState, isInCheck, turn, onDragEnd, onSquareClick, selectPiece]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-2 flex flex-col lg:flex-row justify-center items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded absolute top-2 right-2"
          title="New Game"
          aria-label="Start new game"
        >
          X
        </motion.button>

        <motion.div
          className="chess-board grid grid-cols-8 bg-gray-100 p-2 rounded-lg shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {boardLayout}
        </motion.div>

        <div className="game-info space-y-2 w-full md:w-1/4">
          <CombinedChessClock
            gameStarted={gameStarted}
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            setWhiteTime={setWhiteTime}
            setBlackTime={setBlackTime}
          />

          <div className="game-history overflow-y-auto h-32 lg:h-64">
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
      {promotion && (
        <PromotionChoice
          color={promotion.color}
          onSelect={handlePromotionChoice}
        />
      )}
      {/* {checkMate && <GameOver onNewGame={resetGame} />} */}
    </Suspense>
  );
};

export default memo(Board);
