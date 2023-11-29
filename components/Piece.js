import React from "react";

const Piece = ({ piece }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      {piece && (
        <img
          src={`/images/${piece}.svg`}
          alt={piece}
          className="max-h-full max-w-full p-1"
        />
      )}
    </div>
  );
};

export default Piece;
