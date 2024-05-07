import { useEffect, useState } from "react";
import { ActivityResponse } from "../../types/activity";
import { getAllActivities } from "../../utils/apiFunctions";
import Card from "../common/Card";
import Stack from '@mui/material/Stack';
import Skeleton from "@mui/material/Skeleton";

const Featured = () => {
    const [data, setData] = useState<ActivityResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<ActivityResponse[]>([]);

    console.log(data)
    useEffect(() => {
        setIsLoading(true);
        getAllActivities()
            .then((data: ActivityResponse[]) => {
                setData(data);
                setFilteredData(data);
                setIsLoading(false);
            })
            .catch((error: Error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const renderActivities = () => {
        return filteredData
            .slice(0, 15)
            .map((activity: ActivityResponse) => <Card key={activity.id} activity={activity} />);
    };
    const renderSkeletonActivities = () => {
        return Array(15).fill(0).map((_) => (
            <Stack spacing={1} className="block rounded-3xl z-100  mt-12 p-1 ml-4 ">
                <Skeleton variant="rounded" sx={{ fontSize: '16rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="rounded" sx={{ fontSize: '2rem' }} />
            </Stack >
        ));
    };
    return (
        <div>
            <div className="pt-36 text-center">
                <h2 className="text-4xl mb-3 font-bold">
                    Featured Experiences
                </h2 >
                <p className="text-xl mb-3">Discover the Featured listings in New York on user reviews and ratings.
                </p>
            </div>

            <div className="grid grid-cols-3 px-8">
                {filteredData.length > 0 ? renderActivities() : renderSkeletonActivities()}

            </div>

        </div>




    );
}

export default Featured