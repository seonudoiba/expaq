// import { useState } from 'react'
import React, { useEffect, useState } from 'react'
import { GrMail } from 'react-icons/gr'
import { IoIosCall } from 'react-icons/io'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { FaLinkedinIn, FaFacebookF, FaUser, FaLock, FaList } from 'react-icons/fa'
import { AiOutlineTwitter, AiFillGithub, AiFillHeart, AiFillShopping } from 'react-icons/ai'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logout from '../auth/Logout'
// import { useSelector, useDispatch } from 'react-redux'
// import { get_card_products, get_wishlist_products } from '../store/reducers/cardReducer'

const Header = () => {

    const location = useLocation();
    const pathname = location.pathname;
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    // const { categorys } = useSelector(state => state.home)
    // const { userInfo } = useSelector(state => state.auth)
    // const { card_product_count, wishlist_count } = useSelector(state => state.card)

    const [showShidebar, setShowShidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('')

    // const search = () => {
    //     navigate(`/products/search?category=${category}&&value=${searchValue}`)
    // }
    // const redirect_card_page = () => {
    //     if (userInfo) {
    //         navigate(`/card`)
    //     } else {
    //         navigate(`/login`)
    //     }
    // }

    // useEffect(() => {
    //     if (userInfo) {
    //         dispatch(get_card_products(userInfo.id))
    //         dispatch(get_wishlist_products(userInfo.id))
    //     }
    // }, [userInfo])


    // const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    // const [isHovered, setIsHovered] = useState(false);

    // const toggleSubMenu = () => {
    //     setIsSubMenuOpen(!isSubMenuOpen);
    // };

    // const handleHover = () => {
    //     setIsHovered(!isHovered);
    //     setIsSubMenuOpen(!isSubMenuOpen);
    // };
    const [userInfo, setUserInfo] = useState<{ userId: string; userRole: string }>({ userId: '', userRole: '' });

    useEffect(() => {
        // Retrieve user information from localStorage
        const userId = localStorage.getItem("userId") as string;
        const userRole = localStorage.getItem("userRole") as string;

        // Set user information into the userInfo state
        setUserInfo({ userId, userRole });
    }, [userInfo.userId, userInfo.userRole]);

    console.log(userInfo);
    return (
        <header>
            <nav className="fixed overflow-hidden z-20 w-full bg-white dark:bg-gray-950/75 dark:shadow-md rounded-b-lg dark:shadow-gray-950/10 border-b border-[--ui-light-border-color] border-x dark:border-[--ui-dark-border-color] backdrop-blur">
                <div className=" m-auto 2xl:px-0">
                    <div className="flex justify-center items-center py-2 sm:py-4 ">
                        {/* <div className="w-full items-center flex justify-between lg:w-auto">
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
                        </div> */}

                        <div className='w-white w-full px-12'>
                            <div className=' mx-auto'>
                                <div className='h-[80px] md-lg:h-[100px] flex justify-between  items-center w-[100%]'>
                                    <div className=' md-lg:pt-4 '>
                                        <div className='flex justify-between items-center'>
                                            <Link to='/'>
                                                <img src="/logo.svg" alt="expaq logo" className="w-auto h-12" />
                                            </Link>

                                            <div className='justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border
                                             border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden'
                                                onClick={() => setShowShidebar(false)}>
                                                <span><FaList /></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <div className='flex justify-end gap-16 items-center flex-wrap pl-8'>
                                            <ul className='flex justify-start items-start gap-8 text-sm font-bold uppercase md-lg:hidden'>
                                                <li>
                                                    <Link className={`p-2 block ${pathname === '/' ? 'text-[#7d95f6]' : 'text-slate-600'}`} to={''}>Home</Link>
                                                </li>
                                                <li>
                                                    <Link to='/activities' className={`p-2 block ${pathname === '/activities' ? 'text-[#7d95f6]' : 'text-slate-600'}`}>Activities</Link>
                                                </li>
                                                <li>
                                                    <Link className={`p-2 block ${pathname === '/blog' ? 'text-[#7d95f6]' : 'text-slate-600'}`} to={''}>Blog</Link>
                                                </li>
                                                <li>
                                                    <Link className={`p-2 block ${pathname === '/about' ? 'text-[#7d95f6]' : 'text-slate-600'}`} to={''}>About</Link>
                                                </li>
                                                <li>
                                                    <Link className={`p-2 block ${pathname === '/contact' ? 'text-[#7d95f6]' : 'text-slate-600'}`} to={''}>Contact</Link>
                                                </li>
                                            </ul>
                                            <div className='flex justify-center items-center gap-5'>
                                                {
                                                    
                                                    userInfo.userId !== null? 
                                                    <Logout />
                                                   : <Link to='/login' className='flex cursor-pointer justify-center items-center gap-2 text-sm'>
                                                        <span><FaLock /></span>
                                                        <span>Login</span>
                                                    </Link>
                                                }
                                            </div>
                                            {/* <div className='flex md-lg:hidden justify-center items-center gap-5'>
                                                <div className='flex justify-center gap-5'>
                                                    <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                                        <span className='text-xl text-red-500'><AiFillHeart /></span>
                                                        {
                                                            wishlist_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                                                {wishlist_count}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div onClick={redirect_card_page} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                                        <span className='text-xl text-orange-500'><AiFillShopping /></span>
                                                        {
                                                            card_product_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                                                {
                                                                    card_product_count
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header