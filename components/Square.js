import React from "react";

const Square = ({ children, position, onClick }) => {
  const isBlack = (Math.floor(position / 8) + position) % 2 === 1;
  const bgColor = isBlack ? "bg-green-800" : "bg-gray-200";

  return (
    <div
      className={`w-full aspect-square ${bgColor} flex justify-center items-center`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Square;
