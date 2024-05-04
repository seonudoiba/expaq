import { useState } from 'react'
import { Link } from 'react-router-dom';


const Header = () => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const handleHover = () => {
        setIsHovered(!isHovered);
        setIsSubMenuOpen(!isSubMenuOpen);
    };
    return (
        <header>
            <nav className="fixed overflow-hidden z-20 w-full bg-white dark:bg-gray-950/75 dark:shadow-md rounded-b-lg dark:shadow-gray-950/10 border-b border-[--ui-light-border-color] border-x dark:border-[--ui-dark-border-color] backdrop-blur">
                <div className="px-6 m-auto max-w-6xl 2xl:px-0">
                    <div className="flex flex-wrap items-center justify-between py-2 sm:py-4">
                        <div className="w-full items-center flex justify-between lg:w-auto">
                            <a href="/" aria-label="tailus logo">
                                <img src="/logo.svg" alt="expaq logo" className="w-auto h-12" />
                            </a>
                            <div className="flex lg:hidden">
                                <button aria-label="humburger" id="menu" className="relative border bordeer-gray-950/30 dark:border-white/20 size-9 rounded-full transition duration-300 active:scale-95">
                                    <div aria-hidden="true" id="line1" className="m-auto h-[1.5px] w-4 rounded bg-gray-900 transition duration-300 dark:bg-gray-300"></div>
                                    <div aria-hidden="true" id="line2" className="m-auto mt-1.5 h-[1.5px] w-4 rounded bg-gray-900 transition duration-300 dark:bg-gray-300"></div>
                                </button>
                            </div>
                        </div>
                        <div className="w-full h-0 lg:w-fit flex-wrap justify-end items-center space-y-8 lg:space-y-0 lg:flex lg:h-fit md:flex-nowrap">
                            <div className="mt-6 text-gray-600 dark:text-gray-300 md:-ml-4 lg:pr-4 lg:mt-0">
                                <ul className="space-y-6 tracking-wide text-base lg:text-sm lg:flex lg:space-y-0">
                                    {/* <li className="relative bg-slate-950">
                                        <button
                                            className="block md:px-4 transition hover:text-primary dark:hover:text-primary-400 flex items-center"
                                            onClick={toggleSubMenu}
                                            onMouseEnter={handleHover}
                                            onMouseLeave={handleHover}
                                        >
                                            <span>Experiences</span>
                                            <svg
                                                className={`h-5 w-5 ml-1 transform transition-transform ${isSubMenuOpen || isHovered ? 'rotate--0' : 'rotate-0'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 3.586L3.707 9.879a1 1 0 001.414 1.414L10 6.414l5.879 5.879a1 1 0 001.414-1.414L10 3.586z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${isSubMenuOpen ? '' : 'hidden'}`}
                                        >
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Option 1</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Option 2</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Option 3</a>
                                        </div>
                                    </li> */}
                                    <li>
                                        <a href="/activities" className="block md:px-4 transition hover:text-primary dark:hover:text-primary-400">
                                            <span>Activities</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block md:px-4 transition hover:text-primary dark:hover:text-primary-400">
                                            <span>Locations</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block md:px-4 transition hover:text-primary dark:hover:text-primary-400">
                                            <span>Hosts</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block md:px-4 transition hover:text-primary dark:hover:text-primary-400">
                                            <span>Blog</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="w-full space-y-2 gap-2 pt-6 pb-4 lg:pb-0 border-t border-[--ui-light-border-color] dark:border-[--ui-dark-border-color] items-center flex flex-col lg:flex-row lg:space-y-0 lg:w-fit lg:border-l lg:border-t-0 lg:pt-0 lg:pl-2">
                                <button className="w-full h-9 lg:w-fit group flex items-center rounded-[--btn-border-radius] disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 *:disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border dark:disabled:border-gray-800 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-800 hover:bg-gray-100 active:bg-gray-200/75 dark:text-gray-300 dark:hover:bg-gray-500/10 dark:active:bg-gray-500/15 lg:text-sm lg:h-8 px-3.5 justify-center">
                                    <Link to={'/login'}>Login</Link >
                                </button>
                                <button type="submit" className="text-white bg-primary my-4 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600
                                 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <Link to={'/register'}>Sign Up</Link >
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header