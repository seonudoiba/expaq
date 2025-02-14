"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import logo from "../../public/expaqlogo.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', active: true },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/packages', label: 'Tour Packages' },
    { href: '/contact', label: 'Contact' }
  ];

  const dropdownItems = [
    { href: '/blog', label: 'Blog Grid' },
    // { href: '/blog/[id]', label: 'Blog Detail' },
    { href: '/blog/1', label: 'Blog Detail' },
    { href: '/destination', label: 'Destination' },
    { href: '/guide', label: 'Travel Guides' },
    { href: '/testimonial', label: 'Testimonial' }
  ];

  const socialLinks = [
    { Icon: Facebook, href: '#' },
    { Icon: Twitter, href: '#' },
    { Icon: Linkedin, href: '#' },
    { Icon: Instagram, href: '#' },
    { Icon: Youtube, href: '#' }
  ];

  return (
    <header className='relative flex flex-direction-column justify-center'>
      {/* Topbar */}
      <div className="hidden w-full md:h-20 md:block md:bg-gray-50 md:pt-3">
        <div className="container w-11/12 mx-12 ">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <p>info@expaq.tours</p>
              </div>
              <span className="px-3 text-gray-600">|</span>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <p>+234 811 680 9425</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {socialLinks.map(({ Icon, href }, index) => (
                <Link 
                  key={index}
                  href={href}
                  className="text-blue-600 px-3 hover:text-blue-800 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="absolute top-2 md:top-12 max-h-20 z-10 rounded-full  w-11/12 bg-white mx-auto shadow-lg  px-6">
        <div className="">
          <nav className="px-4">
            <div className="flex items-start justify-between md:items-center py-3">
              <Link href="/" className="text-2xl font-bold">
                <Image src={logo} alt={'Logo'} width={120} height={30}/>
              </Link>

              <div className={`absolute md:static left-0 top-[67px] rounded-3xl py-4 px-8 w-full bg-white md:bg-none  md:flex items-center justify-center ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 lg:space-y-0 md:space-x-6 gap-3">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`hover:text-blue-600 transition-colors ${
                        item.active ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="relative group">
                    <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                      Pages
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white border shadow-lg">
                      {dropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;