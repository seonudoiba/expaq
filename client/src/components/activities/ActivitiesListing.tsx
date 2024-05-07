import  { useEffect, useState } from "react";
import { getAllActivities } from "../../utils/apiFunctions";
import Card from "../common/Card";
import ActivityFilter from "../common/ActivityFilter";
import ActivityPaginator from "../common/ActivityPaginator";
import { ActivityResponse } from '../../types/activity';

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

    if (isLoading) {
        return <div>Loading activities.....</div>;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / activitiesPerPage);

    const renderActivities = () => {
        const startIndex = (currentPage - 1) * activitiesPerPage;
        const endIndex = startIndex + activitiesPerPage;
        return filteredData
            .slice(startIndex, endIndex)
            .map((activity: ActivityResponse) => <Card key={activity.id} activity={activity} />);
    };

    return (
        <div>
            <div className="pt-36">
                <div  className="mb-3 mb-md-0 ">
                    <ActivityFilter data={data} setFilteredData={setFilteredData} /> 
                </div>
                <div  className="d-flex align-items-center justify-content-end">
                    
                    <ActivityPaginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <div className="pt-2 text-center">
                <h2 className="text-4xl mb-3 font-bold">
                    All Activities
                </h2 >
                <p className="text-xl mb-3">Discover Popular Activities All Around the World.
                </p>
            </div>
            <div className="grid grid-cols-3 px-8">{renderActivities()}</div>

            <div>
                <div  className="d-flex align-items-center justify-content-end">
                    <ActivityPaginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActivitiesListing;
