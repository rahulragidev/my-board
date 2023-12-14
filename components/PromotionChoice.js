import { motion } from "framer-motion";

const PromotionChoice = ({ color, onSelect }) => {
  const pieces = ["Queen", "Knight", "Bishop", "Rook"];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const imageVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
      },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <motion.div
        className="mx-auto p-4 rounded-lg bg-green-900 bg-opacity-70"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="flex justify-center space-x-4">
          {pieces.map((piece) => (
            <motion.button
              key={piece}
              className="rounded-lg overflow-hidden"
              onClick={() => onSelect(piece)}
              variants={imageVariants}
              whileHover="hover"
              whileTap="tap"
              initial="pulse"
              animate="pulse"
            >
              <motion.img
                src={`/images/${piece.toLowerCase()}-${color}.svg`}
                alt={`${color} ${piece}`}
                className="h-12 w-12"
                variants={imageVariants}
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PromotionChoice;
