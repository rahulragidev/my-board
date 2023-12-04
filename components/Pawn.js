import React from "react";
import Image from "next/image"; // Make sure to import Image from next/image

const Pawn = ({ color, square }) => {
  return (
    <div>
      <Image
        src={`/images/pawn-${color}.svg`}
        alt={`${color} pawn`}
        width={50} // Set the width as needed
        height={50} // Set the height as needed
        layout="fixed" // You can choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </div>
  );
};

export default Pawn;
