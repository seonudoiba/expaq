"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const About = () => {
    const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');
    
    const handleTabChange = (tab: 'mission' | 'vision' | 'values') => {
        setActiveTab(tab);
    };
    
    const tabContent = {
        mission: "At Expaq, we believe that the best way to experience a new destination is through the eyes of those who call it home. We connect travelers with local hosts worldwide, offering authentic cultural exchange tours that go beyond the typical tourist experience.",
        vision: "Our vision is to create a global community where cultural exchange is at the heart of every journey. We aim to make travel more meaningful, authentic, and enriching for both travelers and local hosts alike.",
        values: "We value authenticity, cultural respect, meaningful connections, and sustainable tourism. We believe that travel should benefit both visitors and the communities they explore."
    };    return (
        <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {/* Left side - Image with floating elements */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/30 before:z-10">
                        <Image
                            src="/img/about.jpg"
                            alt="About Expaq"
                            fill
                            priority
                            className="object-cover object-center transition-transform hover:scale-105 duration-700"
                        />
                        {/* Floating badge - animated stat */}
                        <div className="absolute -right-6 -bottom-6 bg-white rounded-xl shadow-lg p-4 animate-float z-20">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-primary">120+</span>
                                <span className="text-sm text-gray-600">Destinations</span>
                            </div>
                        </div>
                        
                        {/* Floating highlight image - top left */}
                        <div className="absolute -top-8 -left-8 w-24 h-24 rounded-lg shadow-xl overflow-hidden border-4 border-white rotate-6 hover:rotate-0 transition-all duration-300 z-20">
                            <Image
                                src="/img/about-1.jpg"
                                alt="Experience highlight"
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Testimonial floating card */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-[80%] z-20">
                            <div className="flex items-center space-x-2">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src="/img/testimonial-1.jpg"
                                        alt="Happy customer"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium text-gray-800 truncate">"Incredible local experience!"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Content */}
                <div className="w-full lg:w-1/2 lg:pl-8">
                    <div className="space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                                DISCOVER OUR STORY
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                                Connecting Travelers with Local Hosts for <span className="text-primary">Authentic Experiences</span>
                            </h2>
                        </div>
                        
                        {/* Tab navigation */}
                        <div className="flex border-b border-gray-200 mt-8">
                            <button 
                                onClick={() => handleTabChange('mission')}
                                className={`pb-2 mr-8 font-medium ${activeTab === 'mission' 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Our Mission
                            </button>
                            <button 
                                onClick={() => handleTabChange('vision')}
                                className={`pb-2 mr-8 font-medium ${activeTab === 'vision' 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Our Vision
                            </button>
                            <button 
                                onClick={() => handleTabChange('values')}
                                className={`pb-2 font-medium ${activeTab === 'values' 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Our Values
                            </button>
                        </div>
                        
                        {/* Tab content */}
                        <div className="min-h-[100px]">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {tabContent[activeTab]}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:bg-primary/5">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">5000+ Tours</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:bg-primary/5">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Expert Local Guides</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="text-base px-8 rounded-full font-medium hover:scale-105 transition-transform">
                                Book an Experience
                            </Button>
                            <Button variant="outline" size="lg" className="text-base px-8 rounded-full font-medium hover:bg-primary/5">
                                Become a Host
                            </Button>
                        </div>
                        
                        {/* Trust indicators */}
                        <div className="pt-10 border-t border-gray-200 mt-8">
                            <p className="text-sm text-gray-500 mb-4">Trusted by travelers worldwide</p>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="text-gray-400 font-bold">TripAdvisor</div>
                                <div className="text-gray-400 font-bold">Expedia</div>
                                <div className="text-gray-400 font-bold">Booking.com</div>
                                <div className="text-gray-400 font-bold">Airbnb</div>
                            </div>
                </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default About;
