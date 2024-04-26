
const Footer = () => {
    return (
        <footer className="rounded-xl border border-[--ui-light-border-color] dark:border-[--ui-dark-border-color]">
            <div className="max-w-6xl mx-auto space-y-16 px-6 py-16 text-gray-600 2xl:px-0">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8 border-[--ui-light-border-color] dark:border-[--ui-dark-border-color]">
                    <a href="/" aria-label="tailus logo">
                        <img src="/logo.svg" alt="expaq logo" className="w-auto h-12" />
                    </a>
                    <div className="flex gap-3">
                        <a href="https://github.com/seonudoiba" target="blank" aria-label="github" className="size-8 flex *:m-auto rounded-[--btn-border-radius] text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">
                            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                        </a>
                        <a href="https://twitter.com/aigbehinadun" target="blank" aria-label="twitter" className="size-8 flex *:m-auto rounded-[--btn-border-radius] text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">
                            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                            </svg>

                        </a>
                        <a href="https://youtube.com/expaq" target="blank" aria-label="medium" className="size-8 flex *:m-auto rounded-[--btn-border-radius] text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">
                            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73" /></svg>
                        </a>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="p-6 mr-2 sm:rounded-lg ">
                        <h1 className="text-2xl sm:text-3xl  dark:text-white font-extrabold tracking-tight">
                            Get in touch
                        </h1>

                        <div className="flex items-center mt-8">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="ml-4 text-md tracking-wide font-semibold ">
                                Acme Inc, Street, State,
                                Postal Code
                            </div>
                        </div>

                        <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div className="ml-4 text-md tracking-wide font-semibold w-40">
                                +234 811 680 9425
                            </div>
                        </div>

                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="ml-4 text-md tracking-wide font-semibold w-40">
                                info@expaq.org
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="text-xl font-semibold text-gray-950 dark:text-white">Discover</span>
                        <ul className="mt-4 list-inside space-y-4">
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Florida</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Lagos</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Alaska</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Ohio</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <span className="text-xl font-semibold text-gray-950 dark:text-white">Top Hosts</span>
                        <ul className="mt-4 list-inside space-y-4">
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">GitHub</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Discord</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Slack</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">X / Twitter</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <span className="text-xl font-semibold text-gray-950 dark:text-white">Community</span>
                        <ul className="mt-4 list-inside space-y-4">
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">GitHub</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Discord</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">Slack</a>
                            </li>
                            <li>
                                <a href="#" className="text-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">X / Twitter</a>
                            </li>
                        </ul>

                        <form className="mt-12 max-w-xs w-full">
                            <div className="space-y-2.5 has-[:disabled]:has-[:where(label,span)]:select-none has-[:disabled]:has-[:where(label,span)]:opacity-50 text-gray-950 dark:text-white has-[:disabled]:has-[:where(label,span)]:text-gray-600 dark:has-[:disabled]:has-[:where(label,span)]:text-gray-400">
                                <label className="block font-medium " htmlFor="email">Subscribe to our newsletter</label>
                                <input className="w-full focus:outline rounded-[--field-border-radius] appearance-none transition duration-300 peer border shadow focus:outline-2 focus:-outline-offset-1 focus:border-transparent disabled:shadow-none bg-transparent outline-primary-600 shadow-gray-700/5 border-[--field-light-border-color] hover:border-[--field-light-border-hover-color] placeholder-gray-400 text-gray-700 dark:bg-[--field-dark-bg] dark:focus:bg-[--field-dark-focus-bg] dark:outline-primary-500 dark:shadow-gray-950/40 dark:border-[--field-dark-border-color] dark:hover:border-[--field-dark-border-hover-color] dark:placeholder-gray-600 dark:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:placeholder-gray-300 dark:disabled:bg-gray-600/10 dark:disabled:border-gray-600/20 dark:disabled:text-gray-600 dark:disabled:placeholder-gray-700 text-base h-9 px-3" placeholder="Your email" type="email" id="email" required name="email" />
                                <span className="hidden peer-disabled:text-gray-600 dark:peer-disabled:text-gray-400 text-gray-500 dark:text-gray-400 text-md">Helper me7sage</span>
                            </div>
                            
                            <button type="submit" className="text-white bg-primary my-4 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Subscribe</button>

                        </form>
                    </div>


                </div>
                <div className="flex items-center justify-between rounded-md bg-primary px-6 py-3 dark:bg-gray-900">
                    <span className="text-white ">&copy; Expaq 2023 - Present</span>
                    <a href="#" className="text-md text-white hover:text-primary-600 ">Licence</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer