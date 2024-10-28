"use client"
// import Card from "../common/Card";
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import { ActivityResponse } from "../../types/activity";
import { useEffect, useState } from "react";
import { getActivityTypes } from "../../utils/apiFunctions";


const TypesCarousel: React.FC = () => {
  const [activityTypes, setActivityTypes] = useState<string[]>([]);


  useEffect(() => {
    getActivityTypes().then((data) => {
      setActivityTypes(data);
    });
  }, []);

  // const renderActivitiesTypes = () => {

  //   return activityTypes
  //     .map((activityType: string) => (
  //       <div id="item4" className="carousel-item w-full flex flex-col justify-center items-center">
  //           <img src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg" className="w-full" />
  //           <h2>{activityType}</h2>
  //       </div>
  //     ));
  // };

  // const responsive = {
  //   superLargeDesktop: {
  //     // the naming can be any, depends on you.
  //     breakpoint: { max: 4000, min: 3000 },
  //     items: 5
  //   },
  //   desktop: {
  //     breakpoint: { max: 3000, min: 1024 },
  //     items: 3
  //   },
  //   tablet: {
  //     breakpoint: { max: 1024, min: 464 },
  //     items: 2
  //   },
  //   mobile: {
  //     breakpoint: { max: 464, min: 0 },
  //     items: 1
  //   }
  // };

  return (
    <div>
      <div className="pt-36 text-center">
        <h2 className="text-4xl mb-3 font-bold">
          Popular Things to do.
        </h2>
        <p className="text-xl">Discover some of the most popular listings in New York on user reviews and ratings.
        </p>
        </div>
      
        <div className="flex justify-center">

<div className="car w-[90vw] px-[2vw] text-center gap-4 mt-12 flex items-center justify-center ">
    <div className="bg-[url('/cooking-class.jpg')] w-2/3 h-[55vh] rounded-xl bg-no-repeat relative hover:cursor-pointer ">
        <div className="absolute bottom-12 text-center w-full text-white">
            <h2 className="text-xl">{activityTypes[0]}</h2>
            {/* <p className="">3 Listings</p> */}
        </div>                
    </div>
    <div className="bg-[url('/wellness-retreat.jpg')] w-1/3 h-[55vh] rounded-xl bg-no-repeat relative hover:cursor-pointer ">
        <div className="absolute bottom-12 text-center w-full text-white">
            <h2 className="text-xl">{activityTypes[1]}</h2>
            {/* <p className="">1 Listings</p> */}
        </div>
    </div>
</div>

</div>
<div className="flex justify-center">
<div className="car w-[90vw] px-[2vw] text-center gap-4 mt-12 flex items-center justify-center ">
    <div className="bg-[url('/language-xchange.jpg')] w-1/3 h-[55vh] rounded-xl bg-no-repeat relative hover:cursor-pointer ">
        <div className="absolute bottom-12 text-center w-full text-white">
            <h2 className="text-xl">{activityTypes[2]}</h2>
            {/* <p className="">3 Listings</p> */}
        </div>                
    </div>
    <div className="bg-[url('/artisan-workshop.jpg')] w-2/3 h-[55vh] rounded-xl bg-no-repeat relative hover:cursor-pointer ">
        <div className="absolute bottom-12 text-center w-full text-white">
            <h2 className="text-xl">{activityTypes[3]}</h2>
            {/* <p className="">1 Listings</p> */}
        </div>
    </div>
</div>   
</div>
    </div>




  );
}

export default TypesCarousel;