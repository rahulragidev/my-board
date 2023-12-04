import React from "react";
import Image from "next/image"; // Make sure to import Image from next/image

const King = ({ color, square }) => {
  return (
    <div>
      <Image
        src={`/images/king-${color}.svg`}
        alt={`${color} king`}
        width={50} // Set the width as needed
        height={50} // Set the height as needed
        layout="fixed" // You can choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </div>
  );
};

export default King;
