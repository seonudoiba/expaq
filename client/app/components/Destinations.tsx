import Image from 'next/image';

const destinations = [
  { name: 'United States', image: '/img/destination-1.jpg', cities: 100 },
  { name: 'United Kingdom', image: '/img/destination-2.jpg', cities: 100 },
  { name: 'Australia', image: '/img/destination-3.jpg', cities: 100 },
  { name: 'India', image: '/img/destination-4.jpg', cities: 100 },
  { name: 'South Africa', image: '/img/destination-5.jpg', cities: 100 },
  { name: 'Indonesia', image: '/img/destination-6.jpg', cities: 100 },
];



export default function Destinations() {
  return (
    <div className="py-10 w-11/12 mx-auto">
      <section className="text-center">
        <h6 className="text-purple-700 uppercase tracking-widest">Destination</h6>
        <h1 className="text-2xl font-semibold">Explore Top Destinations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {destinations.map((destination, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
              <Image src={destination.image} alt={destination.name} width={400} height={300} className="w-full h-auto" />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white">
                <h5 className="text-lg font-semibold">{destination.name}</h5>
                <span>{destination.cities} Cities</span>
              </div>
            </div>
            
            
          ))}
        </div>
      </section>

     
    </div>
  );
}
