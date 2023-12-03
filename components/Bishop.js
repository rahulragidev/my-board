import React from "react";

const Bishop = ({ color }) => (
  <img src={`/images/bishop-${color}.svg`} alt={`${color} bishop`} />
);

export default Bishop;
