"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import logo from '/../../public/expaqlogo.svg'

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
    <header>
      {/* Topbar */}
      <div className="hidden lg:block bg-gray-50 pt-3">
        <div className="container mx-auto">
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
      <div className="relative bg-white shadow-lg">
        <div className="container mx-auto">
          <nav className="px-4">
            <div className="flex justify-between items-center py-3">
              <Link href="/" className="text-2xl font-bold">
                <Image src={logo} alt={'Logo'} width={120} height={30}/>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className={`lg:flex items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;