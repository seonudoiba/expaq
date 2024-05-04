import { useEffect, useState } from "react";
import { ActivityResponse } from "../../types/activity";
import { getAllActivities } from "../../utils/apiFunctions";
import Card from "../common/Card";

const Featured = () => {
    const [data, setData] = useState<ActivityResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        return <div>Loading activities.....</div>
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    


    const renderActivities = () => {
        
        return filteredData
            .slice(0, 15)
            .map((activity: ActivityResponse) => <Card key={activity.id} activity={activity} />);
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
                {renderActivities()}
            </div>
            
        </div>




    );
}

export default Featured