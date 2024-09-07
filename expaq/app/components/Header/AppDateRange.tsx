import { FC } from 'react';
import { DateRange } from 'react-date-range';
// context
import { DATA_ACTION_TYPES } from '../../context/actionTypes';
import { useDataContext } from '../../hooks/useDataContext';

interface IAppDateRangeProps {
  months?: number;
}

const AppDateRange: FC<IAppDateRangeProps> = ({ months }) => {
  const {state, dispatch} = useDataContext();
  const { checkIn, checkOut } = state

  const selectionRange = {
    startDate: checkIn,
    endDate: checkOut,
    key: 'selection',
  };

  const handleDatePicker = (range: { selection: { startDate: any; endDate: any; }; }) => {
    const { startDate, endDate } = range.selection;
    dispatch({ type: DATA_ACTION_TYPES.SET_CHECK_IN, payload: startDate });
    dispatch({ type: DATA_ACTION_TYPES.SET_CHECK_OUT, payload: endDate });
  };

  return (
    <div className="md:py-4 rounded-3xl">
      <DateRange
        // ranges={[selectionRange]}
        // onChange={handleDatePicker}
        months={months || 2}
        direction="horizontal"
        showMonthAndYearPickers={false}
        rangeColors={['#F7F7F7']}
        minDate={new Date()}
        showDateDisplay={false}
        monthDisplayFormat="MMMM YYY"
      />
    </div>
  );
};

export default AppDateRange;
