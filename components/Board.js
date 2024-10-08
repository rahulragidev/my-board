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
  calculatePossibleMoves,
} from "../utils/ChessUtils";
import { motion } from "framer-motion";
import GameHistory from "./GameHistory";
import GameOver from "./GameOver";
import PromotionChoice from "./PromotionChoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faReply,
  faTimes,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
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
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [recentMove, setRecentMove] = useState(null);

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
    setPromotion(null);
    setPossibleMoves([]);
    setRecentMove(null);
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

      // Check if the move is valid
      if (isMoveValid(boardState, fromSquare, toSquare)) {
        setRecentMove({ from: fromSquare, to: toSquare });
        playMoveSound();

        // Prepare the new board state
        const newBoardState = { ...boardState };

        // Handle normal move or capture
        newBoardState[toSquare] = { ...movingPiece, hasMoved: true };
        newBoardState[fromSquare] = null;

        // Handle pawn's double move
        if (
          movingPiece.type === "Pawn" &&
          Math.abs(fromSquare[1] - toSquare[1]) === 2
        ) {
          newBoardState[toSquare] = {
            ...newBoardState[toSquare],
            justDoubleMoved: true,
          };
        }

        //pawn promotion

        if (
          movingPiece.type === "Pawn" &&
          (toSquare[1] === "8" || toSquare[1] === "1")
        ) {
          setPromotion({ fromSquare, toSquare, color: movingPiece.color });
          return;
        }

        // Handle en passant capture
        if (
          movingPiece.type === "Pawn" &&
          Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0)) === 1 &&
          !boardState[toSquare]
        ) {
          const capturedPawnRank =
            movingPiece.color === "white"
              ? parseInt(toSquare[1], 10) - 1
              : parseInt(toSquare[1], 10) + 1;
          const capturedPawnSquare = `${toSquare[0]}${capturedPawnRank}`;
          newBoardState[capturedPawnSquare] = null;
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

        // Update game history
        const movedPiece = boardState[fromSquare]?.type;
        setGameHistory((prevHistory) => [
          ...prevHistory,
          { from: fromSquare, to: toSquare, piece: movedPiece },
        ]);

        // Reset justDoubleMoved for all pawns except the one that just moved
        Object.keys(newBoardState).forEach((key) => {
          if (
            newBoardState[key] &&
            newBoardState[key].type === "Pawn" &&
            key !== toSquare
          ) {
            newBoardState[key].justDoubleMoved = false;
          }
        });
      } else {
        playErrorSound();
      }
      setPossibleMoves([]);
    },
    [
      boardState,
      playMoveSound,
      playErrorSound,
      setGameHistory,
      setTurn,
      setPossibleMoves,
    ]
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
      setRecentMove(null);
      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedPiece(position);
        // Calculate possible moves
        const moves = calculatePossibleMoves(boardState, position);
        setPossibleMoves(moves);
      } else if (selectedPiece) {
        movePiece(selectedPiece, position);
        setSelectedPiece(null);
        setPossibleMoves([]); // Clear possible moves when a move is made
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
        setPossibleMoves([]);
        setRecentMove(null); // Clear the suggestions
        return;
      }

      const closestSquare = findClosestSquare(x, y);
      if (closestSquare) {
        movePiece(fromSquare, closestSquare);
      } else {
        setPossibleMoves([]); // Clear the suggestions if no valid square is found
      }
    },
    [turn, gameStarted, movePiece, calculatePossibleMoves, setPossibleMoves]
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
        const isPossibleMove = possibleMoves.includes(square);
        const isOpponentPiece = piece && piece.color !== turn;
        const containsOpponentPiece = isPossibleMove && isOpponentPiece;
        const isRecentMove =
          recentMove &&
          (recentMove.from === square || recentMove.to === square);

        return (
          <Square
            key={square}
            position={square}
            isDarkSquare={isDarkSquare}
            ref={(el) => (squareRefs.current[square] = el)}
            onClick={() => onSquareClick(square)}
            isKingInCheckSquare={square === kingPosition}
            isPossibleMove={isPossibleMove}
            containsOpponentPiece={containsOpponentPiece} // Pass isPossibleMove as a prop
            isRecentMove={isRecentMove}
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
  }, [boardState, isInCheck, turn, movePiece, possibleMoves, recentMove]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-2 flex flex-col lg:flex-row justify-center items-center gap-4">
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
          <div className="flex space-x-2 p-1 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
              title="New Game"
              aria-label="Start new game"
            >
              <FontAwesomeIcon icon={faUndo} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded-full"
              title="New Game"
              aria-label="Start new game"
            >
              <FontAwesomeIcon icon={faReply} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full"
              title="Resign"
              aria-label="Resign from the game"
            >
              <FontAwesomeIcon icon={faTimes} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded-full"
              title="Offer Draw"
              aria-label="Offer a draw to the opponent"
            >
              <FontAwesomeIcon icon={faHandshake} />
            </motion.button>
          </div>
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
