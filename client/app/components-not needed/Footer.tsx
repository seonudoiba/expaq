// import Link from 'next/link';
// import Image from 'next/image';
// import React from 'react';
// import logo from "../../public/expaqlogo.png"
// import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

// const Footer: React.FC = () => {
//   return (
//     <div>
//       {/* Main Footer Section */}
//       <div className="bg-white border border-t-2 border-purple-700 text-white-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Brand and Social Links */}
//             <div className="mb-8">
//               <Link href="/" className="text-2xl font-bold">
//                 <Image src={logo} alt={'Logo'} width={120} height={30} />
//               </Link>

//               <p className="mt-4">
//               At Expaq, we believe that the best way to experience a new destination 
//                         is through the eyes of those who call it home.
//                                     </p>
//               <h6 className="text-purple-500 uppercase mt-6 mb-4 tracking-widest">Follow Us</h6>
//               <div className="flex space-x-2">
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <FaTwitter />
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <FaFacebook />
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <FaLinkedin />
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <FaInstagram />
//                 </Link>


//               </div>
//             </div>

//             {/* Our Services Links */}
//             <div className="mb-8">
//               <h5 className="text-purple-500 uppercase mb-6 tracking-widest">Our Services</h5>
//               <div className="flex flex-col space-y-2">
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   Travel Guide
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   Travel Packages
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   Travel Blog
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   Ticket Booking
//                 </Link>
//               </div>
//             </div>

//             {/* Menu Links */}
//             <div className="mb-8">
//               <h5 className="text-purple-500 uppercase mb-6 tracking-widest">Footer Menu</h5>
//               <div className="flex flex-col space-y-2">
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>About
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Destination
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Services
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Packages
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Guides
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Testimonial
//                 </Link>
//                 <Link href="#" className="text-white-50 hover:text-purple-700 transition duration-300">
//                   <i className="fa fa-angle-right mr-2"></i>Blog
//                 </Link>
//               </div>
//             </div>

//             {/* Contact Us and Newsletter */}
//             <div className="mb-8">
//               <h5 className="text-purple-500 uppercase mb-6 tracking-widest">Contact Us</h5>
//               <p className="text-white-50 mb-2">
//                 <i className="fa fa-map-marker-alt mr-2"></i>Lagos, Nigeria.
//               </p>
//               <p className="text-white-50 mb-2">
//                 <i className="fa fa-phone-alt mr-2"></i>+234 811 680 9425
//               </p>
//               <p className="text-white-50 mb-4">
//                 <i className="fa fa-envelope mr-2"></i>info@expaq.tours
//               </p>
//               <h6 className="text-purple-500 uppercase mt-6 mb-4 tracking-widest">Newsletter</h6>
//               <div className="flex">
//                 <input
//                   type="text"
//                   className="flex-grow p-3 border border-gray-600 rounded-l"
//                   placeholder="Your Email"
//                 />
//                 <button className="bg-purple-700 text-white px-6 rounded-r hover:bg-purple-700-dark transition duration-300">
//                   Sign Up
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Bottom Section */}
//       <div className="bg-dark border-t border-gray-800 py-6">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center text-center">
//             <p className="text-white-50 mb-2 md:mb-0">
//               Copyright &copy; <Link href="#" className="hover:text-purple-700">expaq.tours</Link>. All Rights Reserved.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Back to Top Button */}
//       <Link href="#" className="fixed bottom-4 right-4 bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-700-dark transition duration-300">
//         <i className="fa fa-angle-double-up"></i>
//       </Link>
//     </div>
//   );
// };

// export default Footer;

import Link from "next/link"
import { Compass, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Expaq</span>
            </div>
            <p className="text-muted-foreground">
              Connecting adventure seekers with unforgettable experiences around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities" className="text-muted-foreground hover:text-foreground">
                  All Activities
                </Link>
              </li>
              <li>
                <Link href="/activities/outdoor" className="text-muted-foreground hover:text-foreground">
                  Outdoor Adventures
                </Link>
              </li>
              <li>
                <Link href="/activities/food" className="text-muted-foreground hover:text-foreground">
                  Food & Drink
                </Link>
              </li>
              <li>
                <Link href="/activities/culture" className="text-muted-foreground hover:text-foreground">
                  Cultural Experiences
                </Link>
              </li>
              <li>
                <Link href="/activities/wellness" className="text-muted-foreground hover:text-foreground">
                  Wellness
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-a-host" className="text-muted-foreground hover:text-foreground">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/host-resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/host-community" className="text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/host-guidelines" className="text-muted-foreground hover:text-foreground">
                  Hosting Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-foreground">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground">© {new Date().getFullYear()} Expaq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}