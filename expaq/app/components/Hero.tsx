
const Hero = () => {
  return (
    <section className="relative h-[65vh] md:h-[85vh]">
      <div className="absolute className='m-[-10vh]' z-10 w-full bg-gradient-to-b from-transparent-black to-transparent h-28" />
    

      <div className="containe">
        <div className="absolute z-10 left-0 right-0 top-[10%] md:top-[10%] xl:top-[10%] pt-16">
          <h1 className="max-w-[950px] xl:max-w-[950px] md:leading-10 mx-auto px-4 text-2xl font-bold tracking-wide text-center text-primary md:px-0 md:text-3xl xl:text-5xl">
          <span className='py-48'>Connect with Locals,</span><br/> Experience Authentic Adventures

          </h1>
          <div >

          <p className='text-secondary text-center md:max-w-[750px] p-4 pt-8  text-sm md:text-lg m-auto'>Discover a World of Unique Experiences.
          Expaq brings travelers and local hosts together, creating unforgettable moments and authentic connections around the globe.</p>
          </div>
          <div className="text-center">
            <button className="px-8 py-2 mx-auto mt-4 text-sm font-medium text-white duration-150 rounded-md sm:py-3 active:scale-90 text-md  md:mx-0 hover:shadow-xl lg:text-base bg-slate-700">
              {/* I&apos;m flexible */}
              Explore Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
