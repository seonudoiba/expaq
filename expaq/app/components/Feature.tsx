"use client"
import React from "react";
import Slider from "react-slick";
import { FEATURE } from "../constants";
import FeatureItem from "./FeatureItem";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import next from "next";

const Feature = () => {
  const NextArrow = (props: any) =>{
    const {onClick} = props;
    return (
      <div onClick={onClick} className="bg-white text-2xl inline 
      rounded-lg shadow-md absolute top-1/2 right-0 lg:-top-24 lg:right-4 z-10 ring-1
      ring-slate-100/5 hover:bg-secondary">
        <RiArrowRightSLine/>

      </div>
    )
  }
  const PrevArrow = (props: any) =>{
    const {onClick} = props;
    return (
      <div onClick={onClick} className="bg-white text-2xl inline 
      rounded-lg shadow-md absolute top-1/2 lg:-top-24 lg:right-20 z-10 ring-1
      ring-slate-100/5 hover:bg-secondary">
        <RiArrowLeftSLine/>

      </div>
    )
  }

  var settings = {
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ]
  };
  return (
    <section className="max_padd_container py-20 xl:py-24 bg-white">
      <div className="w-[90%] m-auto">
        <div className="mx-4">
          <h4 className="bold-18 text-tertiary">What we serve</h4>
          <h3 className="h3 max-w-lg">We Provide Top Destinations</h3>
          <p className="max-w-lg">
            At Expaq, we bridge the gap between travelers and local hosts,
            fostering meaningful connections through shared experiences. Join
            our community to discover unique cultural exchange activities,
            tailored to your interests, language, and cultural background.
            Embark on a journey that transcends borders and enriches your life.
          </p>
        </div>
        {/* container */}
      </div>
      <div className="pt-12">
        <Slider {...settings}> 
          {FEATURE.map((feature) => (
            <FeatureItem key={feature.URL + feature.title} URL={feature.URL} title={feature.title} des={feature.des} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Feature;
