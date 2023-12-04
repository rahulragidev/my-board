import React from "react";
import Image from "next/image"; // Make sure to import Image from next/image

const Bishop = ({ color }) => {
  return (
    <div>
      <Image
        src={`/images/bishop-${color}.svg`}
        alt={`${color} bishop`}
        width={50} // Set the width as needed
        height={50} // Set the height as needed
        layout="fixed" // You can choose between 'fixed', 'fill', 'intrinsic', or 'responsive'
      />
    </div>
  );
};

export default Bishop;
