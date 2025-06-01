// import React from 'react';
// import Image from 'next/image';

// const Testimonial: React.FC = () => {
//   const testimonials = [
//     { id: 1, image: '/img/testimonial-1.jpg', name: 'Client Name', profession: 'Profession', comment: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
//     { id: 2, image: '/img/testimonial-2.jpg', name: 'Client Name', profession: 'Profession', comment: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
//     { id: 3, image: '/img/testimonial-3.jpg', name: 'Client Name', profession: 'Profession', comment: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
//     { id: 4, image: '/img/testimonial-4.jpg', name: 'Client Name', profession: 'Profession', comment: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
//   ];

//   return (
//     <div className="bg-gray-100 py-12 w-11/12 mx-auto">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-8">
//           <h6 className="text-purple-700 uppercase tracking-widest">Testimonial</h6>
//           <h1 className="text-4xl font-bold">What Say Our Clients</h1>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {testimonials.map((testimonial) => (
//             <div key={testimonial.id} className="text-center">
//               <Image width={150} height={150} className="w-24 h-24 rounded-full mx-auto" src={testimonial.image} alt={testimonial.name} />
//               <div className="bg-white p-6 mt-[-48px] rounded-lg shadow-lg">
//                 <p className="text-gray-700 pt-8">{testimonial.comment}</p>
//                 <h5 className="text-xl font-semibold mt-4">{testimonial.name}</h5>
//                 <span className="text-gray-600">{testimonial.profession}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Testimonial;