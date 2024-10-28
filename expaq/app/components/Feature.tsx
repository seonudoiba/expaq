"use client"
import React from "react";
import Slider from "react-slick";
import { FEATURE } from "../constants";
import FeatureItem from "./FeatureItem";

const Feature = () => {
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
      <div>
        <Slider>
          {FEATURE.map((feature) => (
            <FeatureItem key={feature.URL + feature.title} URL={feature.URL} title={feature.title} des={feature.des} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Feature;
