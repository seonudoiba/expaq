// components/CarouselBooking.tsx
"use client"
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import img1 from "../../public/img/carousel-1.jpg"
import img2 from "../../public/img/carousel-2.jpg"
import Button  from "./Button"



const carousels = [
    {
        src: img1,
        alt: 'Slide 1',
        caption: 'Tours & Travel',
        title: 'Let\'s Discover The World Together',
    },
    {
        src: img2,
        alt: 'Slide 2',
        caption: 'Tours & Travel',
        title: 'Discover Amazing Places With Us',
    }
];


const CarouselBooking: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carousels.length);
    };

    useEffect(() => {
        intervalRef.current = setInterval(nextSlide, 60000); // Change slide every minute

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className='relative flex flex-col justify-center items-center'>
            {/* Carousel Start */}
            <div className="relative w-full mx-auto overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {carousels.map((carousel, index) => (
                        //   <div key={index} className="min-w-full">
                        //     <img src={image} alt={`Slide ${index + 1}`} className="w-full h-auto" />
                        //   </div>
                        <div key={index} className={`min-w-full active h-[80vw] md:h-[90vh] flex justify-center items-center`}>
                            <Image className=" w-full object-cover" src={carousel.src} width={1280} height={768} style={{
                                maxWidth: '100%', height: '80vw'
                            }} alt={carousel.alt} />
                            {/* <Image className=" w-full" src={carousel.src} alt={carousel.alt} fill // className="object-cover"// priority 
                              /> */}
                            <div className="mt-24 md:mt-0 absolute carousel-caption flex flex-col items-center justify-center bg-[#00000070] h-full w-full ">
                                <div className="p-3 text-center max-w-3xl">
                                    <h4 className="text-white font-semibold md:text-2xl uppercase mb-4">{carousel.caption}</h4>
                                    <h1 className="text-white font-bold text-4xl md:text-7xl mb-4">{carousel.title}</h1>
                                    <Button/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute  top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
                    <button
                        onClick={() => setCurrentIndex((currentIndex - 1 + carousels.length) % carousels.length)}
                        className="bg-white p-2 rounded-full shadow-md mx-4 hover:bg-gray-200"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={() => setCurrentIndex((currentIndex + 1) % carousels.length)}
                        className="bg-white p-2 rounded-full shadow-md mx-4 hover:bg-gray-200"
                    >
                        &#10095;
                    </button>
                </div>

            </div>



            {/* Carousel End */}
            <div className="absolute top-[80vw] md:top-[70vh]">
                <div className=" pb-5">
                    <div className="bg-white shadow md:rounded-full">
                        <div className="flex flex-col md:flex-row justify-center items-center" >
                            <div className="w-10/12 ">
                                <div className="flex flex-wrap items-center justify-around gap-2 pt-2 md:pt-0">
                                    <div className="w-full  md:w-1/6 md:mb-0">

                                        <select className="custom-select w-full md:pl-4 h-12 md:border-none focus:outline-none focus:ring-0 " defaultValue="Destination">
                                            <option value="1">Destination 1</option>
                                            <option value="2">Destination 2</option>
                                            <option value="3">Destination 3</option>
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/6 md:mb-0 ">
                                        <input type="text" className="w-full form-control pl-1 md:pl-2 border-none focus:outline-none focus:ring-0" placeholder="Depart Date" />
                                    </div>
                                    <div className="w-full md:w-1/6 md:mb-0">
                                        <input type="text" className="w-full form-control pl-1 md:pl-2 border-none focus:outline-none focus:ring-0" placeholder="Return Date" />
                                    </div>
                                    <div className="w-full md:w-1/6 md:mb-0">
                                        <select className=" w-full custom-select  h-12 border-none focus:outline-none focus:ring-0" defaultValue={'Duration'}>
                                            <option value="1">Duration 1</option>
                                            <option value="2">Duration 2</option>
                                            <option value="3">Duration 3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-10/12 py-4 md:w-2/12 ">
                                <button className="bg-[#7b35fc] cursor-pointer md:bg-inherit w-full h-12 md:mt-[-2px]" type="submit">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default CarouselBooking;