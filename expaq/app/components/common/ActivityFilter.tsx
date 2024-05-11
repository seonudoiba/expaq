import  { useState, ChangeEvent } from "react";
import { ActivityResponse } from "../../types/activity";

interface ActivityFilterProps {
  data: ActivityResponse[];
  setFilteredData: React.Dispatch<React.SetStateAction<ActivityResponse[]>>;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState<string>("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedType: string = e.target.value;
    setFilter(selectedType);

    const filteredActivities: ActivityResponse[] = data.filter((activity) =>
      activity.activityType.toLowerCase().includes(selectedType.toLowerCase())
    );
    setFilteredData(filteredActivities);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const activityTypes: string[] = ["", ...new Set(data.map((activity) => activity.activityType))];

  return (
    <div className="input-group mb-3 flex justify-center items-center gap-6 border-b-2 pb-8">
      <span className="input-group-text" id="activity-type-filter">
        Filter activitys by type
      </span>
      <select
        className="form-select placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        aria-label="activity type filter"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">Select a activity type to filter....</option>
        {activityTypes.map((type, index) => (
          <option key={index} value={String(type)}>
            {String(type)}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel" type="button" onClick={clearFilter}>
        Clear Filter
      </button>
      <hr/>
    </div>
  );
};

export default ActivityFilter;
