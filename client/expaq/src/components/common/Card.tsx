//import Activity from "../../types"

import { ActivityResponse } from "../../types/activity"
interface CardProps {
    key: string;
    activity: ActivityResponse;
}
const Card = ({ key, activity }: CardProps) => {
    console.log("key", key)
    console.log(activity)
    const {
        activityType,
        booked,
        bookings,
        capacity,
        description,
        hostName,
        id,
        location,
        photo,
        price,
        title
    } = activity;

    return (
        <div className="block rounded-3xl z-100  mt-12 p-1 ml-4 ">
            <div className="">
                <img className="rounded-xl sm:m-h-64 md:h-64 w-full"
                    src={`data:image/png;base64,${photo as string}`}
                    alt="" />

            </div>

            <div className="py-2 px-1 flex items-start flex-col">
                <div className="pt-6 flex w-full justify-between">
                    <h5 className="mb-2 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50">
                        {title ?? 'No title'}
                    </h5>
                    {/* <h5 className="mb-2 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50 flex">
                        5.0 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            className="w-4 h-4 ml-1 text-yellow-300">
                            <path fill-rule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                clip-rule="evenodd" />
                        </svg>

                    </h5> */}
                </div>
                <p className="mb-1 text-md text-neutral-600 dark:text-neutral-200">
                    {(description ?? 'No description').substring(0, 60) + (description.length > 200 ? '...' : '')}
                </p>
                {/* <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-200">
                    Added X weeks ago
                </p> */}

                <p className="mb-4 font-bold text-base text-neutral-600 dark:text-neutral-200">
                    {location}
                </p>
                <h5 className="mb-12 text-sm leading-tight text-neutral-800 dark:text-neutral-50">
                  <span className="font-bold">${price}</span> per Person
                </h5>
            </div>
        </div>
    )
}

export default Card