import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, RangeKeyDict } from 'react-date-range';

interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
}

interface Props {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
    onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateSlider: React.FC<Props> = ({ onDateChange, onFilterChange }) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: undefined,
        endDate: undefined,
        key: "selection",
    });

    const handleSelect = (ranges: RangeKeyDict) => {
		setDateRange(ranges.selection as DateRange);
		onDateChange(ranges.selection.startDate ?? null, ranges.selection.endDate ?? null);
		onFilterChange(ranges.selection.startDate ?? null, ranges.selection.endDate ?? null);
	};
	
    const handleClearFilter = () => {
        setDateRange({
            startDate: undefined,
            endDate: undefined,
            key: "selection",
        });
        onDateChange(null, null);
        onFilterChange(null, null);
    };

    return (
        <>
            <h5>Filter bookings by date</h5>
            <DateRangePicker ranges={[dateRange]} onChange={handleSelect} className="mb-4" />
            <button className="btn btn-secondary" onClick={handleClearFilter}>
                Clear Filter
            </button>
        </>
    );
};

export default DateSlider;
