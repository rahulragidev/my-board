import React, { useEffect, useState } from "react";

const ChessClock = ({ isActive, time, setTime }) => {
  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time, setTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={`font-bold text-lg ${
        isActive ? "text-orange-600" : "text-gray-800"
      }`}
    >
      {formatTime(time)}
    </div>
  );
};

export default ChessClock;
