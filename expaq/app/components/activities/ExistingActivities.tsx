import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import ActivityFilter from "../common/ActivityFilter";
import ActivityPaginator from "../common/ActivityPaginator";
import { getAllActivities, deleteActivity } from "../../utils/apiFunctions";
import { Activity, ActivityResponse } from '../../types/activity';


const ExistingActivities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activitiesPerPage] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredActivities, setFilteredActivities] = useState<ActivityResponse[]>([]);
  // const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const selectedActivityType = ""
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const result = await getAllActivities();
      setActivities(result);
      setIsLoading(false);
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedActivityType === "") {
      setFilteredActivities(activities);
    } else {
      const filteredActivities = activities.filter(
        (activity) => activity.activityType === selectedActivityType
      );
      setFilteredActivities(filteredActivities);
    }
    setCurrentPage(1);
  }, [activities, selectedActivityType]);

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (activityId: string) => {
    try {
      const result = await deleteActivity(activityId);
      if (result == null) {
        setSuccessMessage(`Activity No ${activityId} was deleted`);
        fetchActivities();
      } else {
        console.error(`Error deleting activity : ${result.data.message}`);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = (
    filteredActivities: ActivityResponse[],
    activitiesPerPage: number,
    activities: Activity[]
  ) => {
    const totalActivities =
      filteredActivities.length > 0 ? filteredActivities.length : activities.length;
    return Math.ceil(totalActivities / activitiesPerPage);
  };

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );

  return (
    <>
      <div className="container col-md-8 col-lg-6">
        {successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}
        {errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
      </div>

      {isLoading ? (
        <p>Loading existing activities</p>
      ) : (
        <>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing Activities</h2>
            </div>

            <div>
              <div className="mb-2 md-mb-0">
                <ActivityFilter data={activities} setFilteredData={setFilteredActivities} />
              </div>
              <div className="d-flex justify-content-end">
                <Link to={"/add-activity"}>
                  <FaPlus /> Add Activity
                </Link>
              </div>
            </div>

            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Activity Type</th>
                  <th>Activity Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentActivities.map((activity) => (
                  <tr key={activity.id} className="text-center">
                    <td>{activity.id}</td>
                    <td>{activity.activityType}</td>
                    <td>{activity.price}</td>
                    <td className="gap-2">
                      <Link to={`/edit-activity/${activity.id}`} className="gap-2">
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ActivityPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(filteredActivities, activitiesPerPage, activities)}
              onPageChange={handlePaginationClick}
            />
          </section>
        </>
      )}
    </>
  );
};

export default ExistingActivities;
