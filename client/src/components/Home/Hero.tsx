import SearchForm from "../common/SearchForm"


const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-cover bg-no-repeat bg-[10%] h-[110vh] bg-[url('/hero.jpg')]">
                <div
                    className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed bg-[hsla(0,0%,0%,0.75)]">
                    <div className="flex h-full items-center justify-center pt-[20vh] pb-[10vh] ">
                        <div className="px-6 text-center text-white md:px-12">
                            <h1 className="mt-6 mb-1 text-2xl font-bold tracking-tight md:text-5xl xl:text-6xl">
                                Explore diverse cultural<br /><span>Activities</span>
                            </h1>
                            <p className=" text-gray-200 mt-6">Find great places to stay, eat, shop, or visit from local experts.</p>
                            <SearchForm/>
                        </div>
                    </div>

            </div>

            {/* <div
    className="-mt-2.5 text-white dark:text-neutral-800 md:-mt-4 lg:-mt-6 xl:-mt-10 h-[50px] scale-[2] origin-[top_center]">
    <img src="/hero.jpg"/>
  </div> */}
        </div>
    )
}

export default Hero