import Image from "next/image";
import Link from "next/link";

const About = () => {
    return (
        <section className="relative w-8/12 mx-auto h-[800px] flex items-center justify-center">
            {/* <div className="w-9/12 mx-auto"> */}
                <div className="grid md:grid-cols-2 items-center ">
                    <div className="relative min-h-[75vw] md:min-h-[75vh]">
                        <Image
                            src="/img/about.jpg"
                            alt="About Us"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg object-cover brightness-[0.7]"
                                        fill
                                        priority
                        />
                    </div>
                    <div className="bg-white  px-8 md:px-10 md:py-6 ml-[-8vw] z-10 shadow-lg ">
                        <h6 className="text-purple-700 uppercase tracking-widest">About Us</h6>
                        <h1 className="md:text-3xl font-semibold my-4">
                        Connecting Travelers with <br/> Local Hosts for Authentic Experiences
                        </h1>
                        <p className="text-gray-600 mb-4">
                        At Expaq, we believe that the best way to experience a new destination 
                        is through the eyes of those who call it home. We connect travelers 
                        with local hosts worldwide, offering authentic cultural exchange tours that go beyond the typical tourist experience. 
                        Whether you are looking to explore hidden gems, experience local 
                        traditions, or share meaningful moments with your host, Expaq makes it possible.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Image
                                src="/img/about-1.jpg"
                                alt="About 1"
                                width={300}
                                height={200}
                                className="rounded-lg"
                            />
                            <Image
                                src="/img/about-2.jpg"
                                alt="About 2"
                                width={300}
                                height={2000}
                                className="rounded-lg"
                            />
                        </div>
                        <div className='flex mt-2 md:my-4'>
                            <Link href={'#'} className="text-2xl cursor-pointer text-white py-3 px-5 bg-[#7b35fc] rounded-full">Book Now</Link>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </section>
    );
};

export default About;
