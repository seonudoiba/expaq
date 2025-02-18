import React from 'react'
import { FaMoneyCheckAlt, FaAward, FaGlobe } from "react-icons/fa";

const Features = () => {
    const features = [
      { icon: FaMoneyCheckAlt, title: "Competitive Pricing" },
      { icon: FaAward, title: "Best Services" },
      { icon: FaGlobe, title: "Worldwide Coverage" },
    ];
  
    return (
      <div className="py-10">
        <div className="container w-11/12 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 bg-white p-6 shadow-lg rounded-lg">
                <div className="flex items-center justify-center bg-purple-700 text-white w-24 h-24 text-4xl">
                  <feature.icon />
                </div>
                <div>
                  <h5 className="text-lg font-bold">{feature.title}</h5>
                  <p className="text-gray-600">Magna sit magna dolor duo dolor labore.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default Features