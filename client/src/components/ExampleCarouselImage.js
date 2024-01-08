import React from "react";
import Image from "react-bootstrap/Image"; // Import the Image component from react-bootstrap

const ExampleCarouselImage = ({ text }) => {
  return (
    <div className='carousel-image-container'>
      <Image
        src='https://www.bartonassociates.com/wp-content/uploads/history-of-doctors_170322_163711.png'
        alt={text}
      />
    </div>
  );
};

export default ExampleCarouselImage;
