import React from 'react'

const Card = () => {
  return (
    <>
<div
	className="flex flex-col space-y-8  min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-gray-300">
<div className="block rounded-lg bg-white w-72 mt-32">
	<div className="relative overflow-hidden bg-cover bg-no-repeat" data-te-ripple-init data-te-ripple-color="light">
		<img className="rounded-lg  sm:m-h-64 md:h-64 w-full" src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-51701996/original/ac2eabbe-da86-4646-a7d7-f6fe48c083b8.jpeg?im_w=720"
                                    alt="" />
		<a href="#!">
			<div
				className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
			</div>
		</a>
	</div>

	<div className="p-2">
		<div className="flex justify-between">
			<h5 className="mb-2 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50">
				Location Name
			</h5>
			<h5 className="mb-2 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50 flex">
				5.0 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
					className="w-4 h-4 ml-1">
					<path fill-rule="evenodd"
						d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
						clip-rule="evenodd" />
				</svg>

			</h5>
		</div>
		<p className="mb-1 text-sm text-neutral-600 dark:text-neutral-200">
			Added X weeks ago
		</p>

		<p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
			Date Range - Owner
		</p>
		<h5 className="mb-2 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50">
			Price per night
		</h5>
	</div>
</div></div></>
  )
}

export default Card
