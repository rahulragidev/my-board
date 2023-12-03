import React from "react";

const Rook = ({ color }) => (
  <img src={`/images/rook-${color}.svg`} alt={`${color} rook`} />
);

export default Rook;
