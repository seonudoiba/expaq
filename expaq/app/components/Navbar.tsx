'use client'
import { FC, useEffect, useState } from 'react';
// import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import './nav.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon } from '@heroicons/react/outline';
import { UserCircleIcon } from '@heroicons/react/solid';
import {NavbarProps} from '../types/Interface'
import AppSearchBar from './Header/AppSearchBar';
import AppSearchBarMobile from './Header/AppSearchBarMobile';
import { EHeaderOpions } from '../types/Enums';


const Navbar: FC<NavbarProps> = ({ exploreNearby, searchPage, query }) => {

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const [isSnapTop, setIsSnapTop] = useState<boolean>(searchPage ? false : true);
  const [isActiveSearch, setIsActiveSearch] = useState<boolean>(
    searchPage ? false : true
  );
  const [activeMenu, setActiveMenu] = useState<EHeaderOpions | null>(
    EHeaderOpions.PLACES_TO_STAY
  );
  setActiveMenu(activeMenu)
  console.log(query, isSnapTop)

  const handleOnScroll = () => {
    const position = window.scrollY;
    if (position >= 50) {
      setIsSnapTop(false);
      setIsActiveSearch(false);
    } else {
      setIsSnapTop(true);
      setIsActiveSearch(true);
    }
  };

  // const headerBehavior = () => {
  //   let style = [];
  //   if (!isSnapTop) style.push('bg-white shadow-lg');
  //   if (!isActiveSearch) style.push('h-[86px] pb-5');
  //   if (isActiveSearch) style.push('pb-8');
  //   return style.join(' ');
  // };

  useEffect(() => {
    // listen to scroll
    if (!searchPage) {
      window.addEventListener('scroll', handleOnScroll);
    }
    return () => window.removeEventListener('scroll', handleOnScroll);
  }, [searchPage]);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  console.log(isOpen, pathname)
  // Array containing navigation items
  const navItems: any[] = [
    // { id: 2, name: 'About', path: '/about' },
    // { id: 3, name: 'Destinations', path: '/destinations' },
    // { id: 4, name: 'Activities', path: '/activities' },
    // { id: 5, name: 'Hosts', path: '/hosts' },
  ];



  return (
    
    <header className='py-4 px-4 sm:px-10 z-50 min-h-[70px] bg-transparent'>
      <div className='relative flex flex-wrap items-center gap-4'>

        <Link href='/'>
          <Image src="/expaqlogo.png" width={150} height={60} alt="Expaq Logo" className='w-36' />
        </Link>

        <div id="collapseMenu z-60"
          className={`${!isOpen && 'hidden'} 'max-lg:hidden lg:!block max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50 z-50' `}>
          <button id="toggleClose" className={`${!isOpen && 'hidden'} 'lg:hidden fixed top-8 right-4 z-[100] rounded-full bg-white p-3'`} onClick={handleClick} >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 fill-primary" viewBox="0 0 320.591 320.591">
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"></path>
            </svg>
          </button>

          <ul
            className='lg:ml-12 lg:flex justify-center items-center gap-x-6 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-full max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
            <li className='mb-6 hidden max-lg:block'>
              <Link href='/'>
                <Image src="/expaqlogo.png" width={150} height={60} alt="Expaq Logo" className='w-36' />
              </Link>

            </li>
            {/* search Navigation */}
            {/* <li className='hidden md:flex'>
              <div className="flex px-3 py-2 rounded-xl search border-primary overflow-hidden max-w-md mx-auto font-[sans-serif]">
                <input type="email" placeholder="Search Activities..."
                  className="w-full outline-none bg-transparent text-gray-600 text-sm" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600">
                  <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                  </path>
                </svg>
              </div>
            </li> */}

            <li
            className= 'max-lg:border-b'
            >
              <Link href='/'
                className={`${(pathname == '/') && 'text-secondary border-b-2 border-secondary '}' hover:text-secondary block  transition-all'`}>Home</Link>

            </li>
            {navItems.map(page => {
              const activePage = (pathname?.startsWith(page.path) && page.path !== '/');

              return (
                <li
                  key={page.id}
                className= 'max-lg:border-b '
                // max-lg:py-3 px-3
                >
                  <Link href={page.path}
                    className={`${activePage && 'text-secondary border-b-2 border-secondary  '} ' hover:text-secondary 
                    block  transition-all'`}>{page.name}</Link>

                </li>
              )

            })}
          </ul>
        </div>

        <div className='flex ml-auto'>
          {/* <button className='px-6 py-2 rounded-xl text-white bg-primary transition-all hover:text-secondary'>Login</button> */}
          <div className="flex items-center justify-end gap-2 ">
            {/* <Link href="/"
                className={`${
                  isSnapTop
                    ? 'text-white hover:bg-white hover:bg-opacity-10'
                    : 'text-gray-500 hover:bg-gray-100 '
                } flex items-center h-10 px-4 rounded-full font-medium tracking-wide text-sm`}
              >
                Become a host
            </Link> */}
          
              <Link href='/'
                className={`hidden hover:text-secondary block font-medium transition-all md:block'`}>Become a host</Link>

            <button className="flex items-center px-6 py-2 bg-white border border-secondary rounded-full h-10 hover:shadow-md">
              <MenuIcon className="h-5 mr-2 text-gray-300" />
              <UserCircleIcon className="h-10 text-gray-300" />
            </button>
          </div>

          <button id="toggleOpen" className={`${isOpen && 'hidden'} ' lg:hidden ml-7 pl-2'`} onClick={handleClick} >
            <svg className="w-8 fill-primary" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
              {/* main search bar */}
              <AppSearchBar
          menu={activeMenu}
          isActiveHeader={isActiveSearch}
          searchPage={searchPage}
          closeSearch={() => setIsActiveSearch(false)}
        />
        {/* mobile search bar */}
        {
          !isOpen && <AppSearchBarMobile exploreNearby={exploreNearby || []} searchPage={searchPage} />

        }
    </header>
  );
};

export default Navbar;