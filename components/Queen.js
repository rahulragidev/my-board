import React from "react";
import Image from "next/image"; // Make sure to import Image from next/image

const Queen = ({ color, square }) => {
  return (
    <div>
      <Image
        src={`/images/queen-${color}.svg`}
        alt={`${color} queen`}
        width={100} // Set the width as needed
        height={100} // Set the height as needed
        layout="fixed" // You can choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </div>
  );
};

export default Queen;
