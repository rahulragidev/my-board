import React from "react";

const Knight = ({ color }) => (
  <img src={`/images/knight-${color}.svg`} alt={`${color} knight`} />
);

export default Knight;
