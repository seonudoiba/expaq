import React from "react";

const Search = () => {
  return (
    <div className="md:mt-8 mt-4 p-4 md:mx-16">
      <div className="text-center">
        <span
          className="bg-white text-primary medium-16 px-12
             py-4 rounded-l-xl rounded-r-xl"
        >
          Search for Activities
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-6 px-8 py-10 md:px-12 bg-white rounded-xl">
        <div className="flex flex-col w-full md:px-6">
          <label htmlFor="city" className="block text-gray-50 pb-2">
            Search your activity:
          </label>
          <div className="flexCenter h-10 px-4 bg-white rounded-full w-full">
            <input
              type="text"
              placeholder="Enter name here..."
              className="bg-transparent border-non outline-non w-full regular-14"
            />

            {/* <MdLocationPin className="text-lg"/> */}
          </div>
        </div>
        <div className="flex flex-col w-full md:px-6">
          <label htmlFor="date" className="block text-gray-50 pb-2">
            {" "}
            Select your date:
          </label>
          <div className="flexCenter h-10 px-4 bg-white rounded-full w-full">
            <input
              type="date"
              className="bg-transparent border-non outline-none
                    w-full regular-14"
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:px-6">
          <div className="flexBetween items-center">
            <label htmlFor="price" className="block text-gray-50 pb-2">
              Max Price:
            </label>
            <h4>$5000</h4>
          </div>
          <div className="flexCenter h-10 px-4 bg-primary rounded-full w-full">
            <input
              type="range"
              max={"5000"}
              min={"1000"}
              className="border-non outline-none
                    w-full regular-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
