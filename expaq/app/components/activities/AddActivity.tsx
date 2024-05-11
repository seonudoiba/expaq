import { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import { addActivity } from "../../utils/apiFunctions";
import ActivityTypeSelector from "../common/ActivityTypeSelector"
// import { Link } from "react-router-dom";


const AddActivity: React.FC<{}> = (): ReactNode => {
  const [newActivity, setNewActivity] = useState({
    photo: null as File | null,
    activityType: "",
    price: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleActivityInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setNewActivity({ ...newActivity, photo: selectedImage });
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await addActivity(newActivity.photo!, newActivity.activityType, parseInt(newActivity.price));
      if (success) {
        setSuccessMessage("A new activity was added successfully!");
        setNewActivity({ photo: null, activityType: "", price: "" });
        setImagePreview("");
        setErrorMessage("");
        console.log("No Error")
      } else {
        setErrorMessage("Error adding new activity");
      }
    } catch (error) {
      setErrorMessage((error as Error).message);

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    };
  };

  return (
    <div>
      <section className="container pt-36 mb-5">
        <div className="grid place-items-center">
            <h2 className="mt-5 mb-2 text-center text-3xl font-semibold">Add a New Activity</h2><hr/>
            {successMessage && <div className="alert alert-success fade show">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className=" ">
              <div className="w-full rounded-md">
                <ActivityTypeSelector
                  handleActivityInputChange={(e: ChangeEvent<HTMLInputElement>) => handleActivityInputChange(e)}
                  newActivity={newActivity}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="block font-semibold py-2">
                  Activity Price
                </label>
                <input
                  required
                  type="number"
                  className="form-control rounded-md w-full"
                  id="price"
                  name="price"
                  value={newActivity.price}
                  onChange={handleActivityInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="block font-semibold w-full rounded-md py-2">
                  Activity Photo
                </label>
                <input
                  required
                  name="photo"
                  id="photo"
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview activity photo"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mb-3"
                  />
                )}
              </div>
              <div className="grid gap-2 md:flex md:mt-2">
                {/* <Link to={"/existing-activities"} className="btn btn-outline-info">
              Existing activities
            </Link> */}
                <button type="submit" className="text-white bg-primary my-4 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Save Activity
                </button>
              </div>
            </form>
         
        </div>
      </section>
    </div>
  );
};

export default AddActivity;
