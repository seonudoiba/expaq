import Search from "./Search";

const Hero = () => {
  return (
    <section className="relative h-[65vh] md:h-[85vh]">
      <div className="absolute w-full bg-gradient-to-b from-black/30 to-transparent h-full" />

      <div className="container relative z-10">
        <div className="absolute left-0 right-0 md:top-[10%] xl:top-[10%] md:pt-16 pt-8">
          <div className="animate-fade-in space-y-6 text-center">
            <h1 className="max-w-[400px] xl:max-w-[520px] md:leading-[1.2] mx-auto p-4 text-5xl font-bold tracking-wide text-white mt-8 md:text-6xl backdrop-blur-sm bg-black/10 rounded-2xl transition-all duration-300 hover:bg-black/20">
              Connect with Locals
            </h1>
            
            <h2 className="max-w-[650px] xl:max-w-[650px] mx-auto p-4 text-2xl md:text-3xl font-bold tracking-wide text-white backdrop-blur-sm bg-black/10 rounded-2xl transition-all duration-300 hover:bg-black/20">
              Experience Authentic Adventures!
            </h2>

            <p className="text-white text-center md:max-w-[750px] p-4 text-lg md:text-xl m-auto backdrop-blur-sm bg-black/10 rounded-2xl transition-all duration-300 hover:bg-black/20">
              Discover unique experiences and create unforgettable moments with local hosts around the globe.
            </p>

            <div className="mt-8 transform transition-all duration-500 hover:scale-[1.02]">
              <Search />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
