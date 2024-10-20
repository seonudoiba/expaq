"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
// import  Search  from "./Search";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  // Array containing navigation items
  const navItems = [
    { id: 2, name: "About", path: "/about" },
    { id: 3, name: "Destinations", path: "/destinations" },
    { id: 4, name: "Activities", path: "/activities" },
    { id: 5, name: "Hosts", path: "/hosts" },
  ];

  return (
    <header className="py-4 md:px-4 sm:px-10 min-h-[70px] bg-transparent">
      <div className="relative md:flex justify-between flex-wrap items-center gap-4">

        {/* Logo and menu icon  */}
        <div className="flex justify-between min-w-full md:min-w-1">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/expaqlogo.png"
              width={150}
              height={60}
              alt="Expaq Logo"
              className="w-36"
            />
          </Link>
          <div className="md:hidden">
            {isOpen ? (
              <button
                // id="toggleClose"
                // className={`${
                //   !isOpen && "hidden"
                // } 'lg:hidden fixed top-8 right-4 z-[100] rounded-full bg-white p-3'`}
                onClick={handleClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 fill-primary"
                  viewBox="0 0 320.591 320.591"
                >
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>
            ) : (
              <button
                // id="toggleOpen"
                // className={`${isOpen && "hidden"} ' hidden ml-7 pl-2'`}
                onClick={handleClick}
              >
                <svg
                  className="w-8 fill-primary"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className={`${!isOpen&& 'hidden '} gap-16 md:flex justify-between items-center max-md:h-[100vh] max-md:bg-white max-md:absolute z-[100]`}>
          <ul className={`md:ml-12 md:flex md:justify-center md:items-center md:gap-x-6 max-md:space-y-3 max-md:min-w-full max-md:bg-white`}>
            <li className="max-lg:border-b">
              <Link
                href="/"
                className={`${
                  pathname == "/" &&
                  "text-secondary border-b-2 border-secondary "
                }' hover:text-secondary block  transition-all'`}
              >
                Home
              </Link>
            </li>
            {navItems.map((page) => {
              const activePage =
                pathname?.startsWith(page.path) && page.path !== "/";

              return (
                <li
                  key={page.id}
                  className="max-lg:border-b "
                  // max-lg:py-3 px-3
                >
                  <Link
                    href={page.path}
                    className={`${
                      activePage &&
                      "text-secondary border-b-2 border-secondary  "
                    } ' hover:text-secondary 
                    block  transition-all'`}
                  >
                    {page.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex md:ml-auto max-md:w-[100vw] p-0 m-0 max-md:p-1 max-md:bg-white" >
            {/* <button className='px-6 py-2 rounded-xl text-white bg-primary transition-all hover:text-secondary'>Login</button> */}
            <div className="flex items-center justify-end gap-2  max-md:w-full max-md:justify-between">
              <Link
                href="/"
                className={`hover:text-secondary font-medium transition-all md:block'`}
              >
                Become a host
              </Link>

              <button className="flex items-center px-6 py-2 bg-white border border-secondary rounded-full h-10 hover:shadow-md">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
