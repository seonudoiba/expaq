import React from 'react';

const Registration: React.FC = () => {
      return (
        <div className="w-full bg-registration py-20 mt-24 ">
          <div className="container mx-auto px-4 lg:px-20">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-2/3 mb-10 lg:mb-0">
                <div className="mb-6">
                  <h6 className="text-purple-600 uppercase tracking-widest">Mega Offer</h6>
                  <h1 className="text-white text-4xl font-bold">
                    <span className="text-purple-600">30% OFF</span> For Honeymoon
                  </h1>
                </div>
                <p className="text-white mb-6">
                  Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo
                  dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo.
                  Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est
                  dolor.
                </p>
                <ul className="text-white space-y-2">
                  <li className="flex items-center">
                    <i className="fa fa-check text-purple-600 mr-3"></i>Labore eos amet dolor amet diam
                  </li>
                  <li className="flex items-center">
                    <i className="fa fa-check text-purple-600 mr-3"></i>Etsea et sit dolor amet ipsum
                  </li>
                  <li className="flex items-center">
                    <i className="fa fa-check text-purple-600 mr-3"></i>Diam dolor diam elitr ipsum vero.
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-purple-600 text-center p-6">
                    <h1 className="text-white text-2xl font-bold">Sign Up Now</h1>
                  </div>
                  <div className="p-6">
                    <form>
                      <div className="mb-4">
                        <input
                          type="text"
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="email"
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          placeholder="Your email"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <select
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option selected>Select a destination</option>
                          <option value="1">Destination 1</option>
                          <option value="2">Destination 2</option>
                          <option value="3">Destination 3</option>
                        </select>
                      </div>
                      <button
                        className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
                        type="submit"
                      >
                        Sign Up Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };    

export default Registration;