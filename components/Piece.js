import Image from "next/image";
import React from "react";

const Piece = ({ piece, onDragStart, draggable = true }) => {
  return (
    <div
      className="flex justify-center items-center w-full h-full"
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {piece && (
        <Image
          src={`/images/${piece}.svg`}
          alt={piece}
          className="max-h-full max-w-full p-1"
          width={50}
          height={50}
        />
      )}
    </div>
  );
};

export default Piece;
