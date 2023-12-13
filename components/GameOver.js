import { motion } from "framer-motion";
const GameOver = ({ onNewGame }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-xl z-50"
    >
      <h2 className="text-2xl font-bold mb-4">Checkmate! Game Over</h2>
      <button
        onClick={onNewGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        New Game
      </button>
    </motion.div>
  );
};

export default GameOver;
