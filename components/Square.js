import React from "react";

const Square = ({ children, position, onClick }) => {
  // Calculate if the square is black or white based on its position
  const isBlackSquare = () => {
    const file = position.charCodeAt(0) - "a".charCodeAt(0); // Convert letter to number (a=0, b=1, c=2, ...)
    const rank = parseInt(position[1], 10) - 1; // Convert rank to 0-indexed number

    return (file + rank) % 2 === 1;
  };

  const bgColor = isBlackSquare() ? "bg-green-800" : "bg-gray-200";
  const hoverEffect = "hover:bg-opacity-75 transition duration-300";

  return (
    <div
      className={`w-full aspect-square ${bgColor} ${hoverEffect} flex justify-center items-center`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Square;
