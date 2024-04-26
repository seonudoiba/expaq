import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getActivityById, updateActivity } from "../../utils/apiFunctions";

import { Activity } from '../../types/activity';

const EditActivity: React.FC = () => {
  const [activity, setActivity] = useState<Activity>({
    photo: "",
    activityType: "",
    price: 0
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { activityId } = useParams<{ activityId: string }>();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setActivity({ ...activity, photo: selectedImage });
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        if (activityId) {
          const activityData = await getActivityById(activityId);
          setActivity(activityData);
          setImagePreview(activityData.photo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSubmit = async (e: FormEvent) => {
    console.log("Added activity", activity)
    e.preventDefault();
    try {
      const response = await updateActivity(activityId!, activity);
      if (response.status === 200) {
        setSuccessMessage("Activity updated successfully!");
        const updatedActivityData = await getActivityById(activityId!);
        setActivity(updatedActivityData);
        setImagePreview(updatedActivityData.photo);
        setErrorMessage("");
      } else {
        setErrorMessage("Error updating activity");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-5 mt-5">Edit Activity</h3>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="activityType" className="form-label hotel-color">
                Activity Type
              </label>
              <input
                type="text"
                className="form-control"
                id="activityType"
                name="activityType"
                value={activity.activityType}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label hotel-color">
                Activity Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={activity.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label hotel-color">
                Photo
              </label>
              <input
                required
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={`${imagePreview}`}
                  alt="Activity preview"
                  style={{ maxWidth: "400px", maxHeight: "400" }}
                  className="mt-3"
                />
              )}
            </div>
            <div className="d-grid gap-2 d-md-flex mt-2">
              <Link to={"/existing-activities"} className="btn btn-outline-info ml-5">
                back
              </Link>
              <button type="submit" className="btn btn-outline-warning">
                Edit Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditActivity;
