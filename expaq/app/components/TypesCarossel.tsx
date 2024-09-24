"use client"
import React, { useState } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  title: string;
}

interface CarouselSliderProps {
  slides: Slide[];
}

const TypesCarossel: React.FC<CarouselSliderProps> = ({ slides }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const handlePrevClick = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  return (
    <div className="carousel-slider bg-background">
      <div className="slider-container">
        <div className="slider-track">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === slideIndex ? 'active' : ''}`}
            >
              <Image src="/expaqlogo.png" width={350} height={450} alt="Expaq Logo" className='w-36' />

              <h2>{slide.title}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="slider-controls">
        <button className="prev-btn" onClick={handlePrevClick}>
          Prev
        </button>
        <button className="next-btn" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TypesCarossel;