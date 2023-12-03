import React from "react";

const Pawn = ({ color }) => (
  <img src={`/images/pawn-${color}.svg`} alt={`pawn-${color}`} />
);

export default Pawn;
