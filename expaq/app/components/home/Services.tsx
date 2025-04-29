import React from 'react';
import { FaRoute, FaTicketAlt, FaHotel, FaPlane, FaCar, FaUmbrella } from "react-icons/fa";

const services = [
    { 
        icon: <FaRoute className="w-8 h-8" />,
        title: "Travel Guide",
        description: "Expert local guides to help you discover authentic experiences and hidden gems.",
        color: "purple"
    },
    { 
        icon: <FaTicketAlt className="w-8 h-8" />,
        title: "Event Tickets",
        description: "Access to exclusive local events, festivals, and cultural performances.",
        color: "blue"
    },
    { 
        icon: <FaHotel className="w-8 h-8" />,
        title: "Accommodations",
        description: "Carefully selected stays that reflect local culture and hospitality.",
        color: "green"
    },
    { 
        icon: <FaPlane className="w-8 h-8" />,
        title: "Transportation",
        description: "Seamless travel arrangements with trusted local providers.",
        color: "red"
    },
    { 
        icon: <FaCar className="w-8 h-8" />,
        title: "Private Tours",
        description: "Personalized experiences tailored to your interests and schedule.",
        color: "yellow"
    },
    { 
        icon: <FaUmbrella className="w-8 h-8" />,
        title: "Travel Insurance",
        description: "Comprehensive coverage for worry-free adventures.",
        color: "indigo"
    }
];

const getGradient = (color: string) => {
    const gradients = {
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        red: 'from-red-500 to-red-600',
        yellow: 'from-yellow-500 to-yellow-600',
        indigo: 'from-indigo-500 to-indigo-600'
    };
    return gradients[color as keyof typeof gradients];
};

const Services = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-purple-600 font-semibold tracking-wider uppercase">Our Services</span>
                    <h2 className="mt-2 text-4xl font-bold text-gray-900">Everything You Need for Perfect Travel</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We provide comprehensive travel services to ensure your journey is comfortable, authentic, and unforgettable
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div 
                            key={index}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <div className="p-8">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient(service.color)} flex items-center justify-center mb-6 text-white transform transition-transform group-hover:scale-110`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                            </div>
                            <div className={`h-1 w-full bg-gradient-to-r ${getGradient(service.color)} transform origin-left scale-x-0 transition-transform group-hover:scale-x-100`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;