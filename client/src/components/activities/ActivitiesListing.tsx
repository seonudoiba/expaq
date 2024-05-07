import { useEffect, useState } from "react";
import { getAllActivities } from "../../utils/apiFunctions";
import Card from "../common/Card";
import ActivityFilter from "../common/ActivityFilter";
import { ActivityResponse } from '../../types/activity';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Skeleton from "@mui/material/Skeleton";

const ActivitiesListing: React.FC = () => {
    const [data, setData] = useState<ActivityResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activitiesPerPage] = useState<number>(30);
    const [filteredData, setFilteredData] = useState<ActivityResponse[]>([]);


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


    const handlePageChange = (event: any, pageNumber: number) => {
        setCurrentPage(pageNumber);
        console.log(pageNumber);
        console.log(event);
    };

    const totalPages = Math.ceil(filteredData.length / activitiesPerPage);

    // const [pagination, setPagination] = useState<PaginationProps>({
    //     count: 0,
    //     from: 0,
    //     to: totalPages,
    // });
  
    const renderActivities = () => {
        const startIndex = (currentPage - 1) * activitiesPerPage;
        const endIndex = startIndex + activitiesPerPage;
        return filteredData
            .slice(startIndex, endIndex)
            .map((activity: ActivityResponse) => <Card key={activity.id} activity={activity} />);
    };
    const renderSkeletonActivities = () => {
        return Array(activitiesPerPage).fill(0).map((_) => (
            <Stack spacing={1} className="block rounded-3xl z-100  mt-12 p-1 ml-4 ">
                <Skeleton variant="rounded" sx={{ fontSize: '16rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} />
                <Skeleton variant="rounded" sx={{ fontSize: '2rem' }} />
            </Stack >
        ));
    };
    console.log("f", filteredData)


    return (
        <div>
            <div className="pt-36">
                <div className="mb-3 mb-md-0 ">
                    <ActivityFilter data={data} setFilteredData={setFilteredData} />
                </div>
            </div>
            <div className="pt-2 text-center">
                <h2 className="text-4xl mb-3 font-bold">
                    All Activities
                </h2 >
                <p className="text-xl mb-3">Discover Popular Activities All Around the World.
                </p>
            </div>
            <div className="grid grid-cols-3 px-8">
                {filteredData.length > 0 ? renderActivities() : renderSkeletonActivities()}
            </div>
        

            <div className="flex w-full items-center justify-center">
                <div>
                    <Stack spacing={2}>
                        <Pagination count={totalPages} color="primary" variant="outlined" showFirstButton showLastButton
                            onChange={handlePageChange} />
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesListing;
