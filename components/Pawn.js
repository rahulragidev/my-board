import { motion } from "framer-motion";
import Image from "next/image";

const Pawn = ({ color, onDragStart, onDragEnd }) => {
  return (
    <motion.div
      drag
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className="cursor-grab"
    >
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={80}
        height={80}
        layout="fixed"
      />
    </motion.div>
  );
};

export default Pawn;
