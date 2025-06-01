// import React from 'react'
// import { FaRoute, FaTicketAlt, FaHotel } from "react-icons/fa";
// const services = [
//     { icon: <FaRoute className='h-20 w-20 text-center border p-4 text-purple-700 border-purple-700 cursor-pointer hover:bg-purple-700 hover:text-white'/>, title: 'Travel Guide', description: 'Expert travel guidance to explore new places safely.' },
//     { icon: <FaTicketAlt className='h-20 w-20 text-center border p-4 text-purple-700 border-purple-700 cursor-pointer hover:bg-purple-700 hover:text-white'/>, title: 'Ticket Booking', description: 'Seamless ticket booking for flights and events.' },
//     { icon: <FaHotel className='h-20 w-20 text-center border p-4 text-purple-700 border-purple-700 cursor-pointer hover:bg-purple-700 hover:text-white'/>, title: 'Hotel Booking', description: 'Find and book top-rated hotels at great prices.' },
// ];

// const Services = () => {
//     return (
//         <section className="text-center my-12 w-11/12 mx-auto">
//             <h6 className="text-purple-700 uppercase tracking-widest">Services</h6>
//             <h1 className="text-2xl font-semibold">Tours & Travel Services</h1>
        
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
//           {services.map((service, index) => (
//             <div key={index} className="bg-white flex flex-col items-center gap-2 p-6 rounded-lg shadow-md text-center">
//               {service.icon}
//               <h5 className="text-lg font-semibold mb-2">{service.title}</h5>
//               <p className="text-gray-600">{service.description}</p>
//             </div>
//           ))}
//         </div>
//         </section>
//     )
// }

// export default Services