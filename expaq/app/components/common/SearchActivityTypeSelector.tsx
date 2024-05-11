import  { useState, useEffect, ChangeEvent } from "react";
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

	useEffect(() => {
		getActivityTypes().then((data) => {
			setActivityTypes(data);
		});
	}, []);

	console.log(activityTypes)

	return (
		<>
			{activityTypes.length > 0 && (
				<div>
					<select
						required
                        className="rounded-lg  border-0 left-0 w-full h-16 md:w-96"
						name="activityType"
						onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
							
								handleActivityInputChange(e as ChangeEvent<HTMLInputElement>); // Type assertion here
							
						}}
						value={newActivity.activityType}
					>

						<option value="">Select an activity type</option>
						{activityTypes.map((type, index) => (
							<option key={index} value={type}>
								{type}
							</option>
						))}
					</select>
				
				</div >
			)}
		</>
	);
};

export default ActivityTypeSelector;
