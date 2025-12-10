import React from 'react';
import banner1 from '../../assets/banners/banner1.jpg';

const Banner = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-5 py-10 grid md:grid-cols-2 gap-4 items-center">

        {/* SEARCH BAR — Mobile: 1st | Desktop: Left side 1st */}
        <div className="order-1 md:order-1 md:-mt-53 ml-10">
          <div className="flex items-center w-full max-w-sm mb-8 mx-auto md:mx-0">
            <span className="text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border-none font-bold rounded-l-full outline-none"
            />
            <button className="bg-orange-500 text-white px-4 py-3 rounded-r-full">
              🔍
            </button>
          </div>
        </div>

        {/* IMAGE — Mobile: 2nd | Desktop: Right side */}
        <div className="order-2 md:order-2 flex justify-center ">
          <div className="w-[320px] md:w-[460px] h-auto mt-19">
            <img src={banner1} alt="" className="w-full h-full md:mb-10 object-cover rounded-lg" />
          </div>
        </div>

        {/* TEXT — Mobile: 3rd | Desktop: Under search on left */}
        <div className="order-3 md:order-2 md:-mt-65 ml-5 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            <span className="text-orange-500">Create</span> your Platform
          </h1>

          <p className="text-gray-400 text-xl font-semibold  mb-6 max-w-md mx-auto md:mx-0">
           ContestHub is a modern, user-friendly platform for creating, discovering, and managing creative contests. From design challenges to writing, business ideas, and gaming reviews, ContestHub connects creators with opportunities to showcase their skills and compete globally.
          </p>

          <div className="flex gap-4 justify-center md:justify-start mb-4">
            <button className="bg-[#FDC700] text-black hover:bg-[#C8BB00] px-6 py-2 rounded-md">
              More info
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;
