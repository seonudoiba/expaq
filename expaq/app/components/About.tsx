import Image from "next/image";
import Link from "next/link";

const About = () => {
    return (
        <div className="py-10 bg-gray-100 max-w-[100vw] ">
            <div className="w-11/12 mx-auto">
                <div className="grid md:grid-cols-2 items-center ">
                    <div className="relative min-h-[100vw] md:min-h-[120vh]">
                        <Image
                            src="/img/about.jpg"
                            alt="About Us"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                    <div className="bg-white h-[85vh] w-[55vw] px-8 md:px-10 md:py-6 ml-[-8vw] z-10 shadow-lg ">
                        <h6 className="text-purple-700 uppercase tracking-widest">About Us</h6>
                        <h1 className="text-4xl font-semibold my-4">
                        We Provide Best Tour <br/>Packages In Your Budget
                        </h1>
                        <p className="text-gray-600 mb-4">
                        Dolores lorem lorem ipsum sit et ipsum. Sadip sea amet diam dolore sed et. 
                        Sit rebum labore sit sit ut vero no sit. Et elitr stet dolor sed 
                        sit et sed ipsum et kasd ut. Erat duo eos et erat sed diam duo
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
            </div>
        </div>
    );
};

export default About;
