import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const destinations = [
  { name: "United States", image: "/img/destination-1.jpg", cities: 100 },
  { name: "United Kingdom", image: "/img/destination-2.jpg", cities: 100 },
  { name: "Australia", image: "/img/destination-3.jpg", cities: 100 },
  { name: "India", image: "/img/destination-4.jpg", cities: 100 },
  { name: "South Africa", image: "/img/destination-5.jpg", cities: 100 },
  { name: "Indonesia", image: "/img/destination-6.jpg", cities: 100 },
];

export default function Destinations() {
  return (
    // <div className="py-10 w-11/12 mx-auto">
    //   <section className="text-center">
    //     <h6 className="text-purple-700 uppercase tracking-widest">Destination</h6>
    //     <h1 className="text-2xl font-semibold">Explore Top Destinations</h1>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
    //       {destinations.map((destination, index) => (
    //         <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
    //           <Image src={destination.image} alt={destination.name} width={400} height={300} className="w-full h-auto" />
    //           <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white">
    //             <h5 className="text-lg font-semibold">{destination.name}</h5>
    //             <span>{destination.cities} Cities</span>
    //           </div>
    //         </div>

    //       ))}
    //     </div>
    //   </section>

    // </div>
    <>
      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Cities</h2>
            <p className="text-muted-foreground mt-2">Explore Top Cities</p>
          </div>
          <Link
            href="/activities"
            className="flex items-center text-primary mt-4 md:mt-0"
          >
            View all Cities <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white">
                <h5 className="text-lg font-semibold">{destination.name}</h5>
                <span>{destination.cities} Cities</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Cities</h2>
            <p className="text-muted-foreground mt-2">Explore Top Cities</p>
          </div>
          <Link
            href="/activities"
            className="flex items-center text-primary mt-4 md:mt-0"
          >
            View all Cities <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white">
                <h5 className="text-lg font-semibold">{destination.name}</h5>
                <span>{destination.cities} Cities</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
