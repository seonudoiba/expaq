import  { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getActivityTypes } from "../../utils/apiFunctions";

interface ActivityTypeSelectorProps {
	handleActivityInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
	newActivity: { activityType: string };
}


const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({
	handleActivityInputChange,
	newActivity,
}) => {
	const [activityTypes, setActivityTypes] = useState<string[]>([]);
	const [showNewActivityTypeInput, setShowNewActivityTypeInput] = useState(false);
	const [newActivityType, setNewActivityType] = useState("");

	useEffect(() => {
		getActivityTypes().then((data) => {
			setActivityTypes(data);
		});
	}, []);

	const handleNewActivityTypeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewActivityType(e.target.value);
	};

	const handleAddNewActivityType = () => {
		if (newActivityType !== "") {
			setActivityTypes([...activityTypes, newActivityType]);
			setNewActivityType("");
			setShowNewActivityTypeInput(false);
		}
	};
	console.log(activityTypes)

	return (
		<>
			{activityTypes.length > 0 && (
				<div>
					<select
						required
						className="form-select"
						name="activityType"
						onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
							if (e.target.value === "Add New") {
								setShowNewActivityTypeInput(true);
							} else {
								handleActivityInputChange(e as ChangeEvent<HTMLInputElement>); // Type assertion here
							}
						}}
						value={newActivity.activityType}
					>

						<option value="">Select an activity type</option>
						<option value={"Add New"}>Add New</option>
						{activityTypes.map((type, index) => (
							<option key={index} value={type}>
								{type}
							</option>
						))}
					</select>
					{showNewActivityTypeInput && (
						<div className="mt-2">
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									placeholder="Enter New Activity Type"
									value={newActivityType}
									onChange={handleNewActivityTypeInputChange}
								/>
								<button className="btn btn-hotel" type="button" onClick={handleAddNewActivityType}>
									Add
								</button>
							</div>
						</div>
					)}
				</div >
			)}
		</>
	);
};

export default ActivityTypeSelector;
