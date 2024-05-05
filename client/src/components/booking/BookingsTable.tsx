import { parseISO } from "date-fns";
import { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";

interface Booking {
    id: string;
    activity: { id: string; activityType: string };
    checkInDate: string;
    checkOutDate: string;
    guestName: string;
    guestEmail: string;
    numOfAdults: string;
    numOfChildren: string;
    totalNumOfGuests: string;
    bookingConfirmationCode: string;
}

interface Props {
    bookingInfo: Booking[];
    handleBookingCancellation: (bookingId: string) => void;
}

const BookingsTable: React.FC<Props> = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookingInfo);

    const filterBookings = (startDate: Date | null, endDate: Date | null) => {
        let filtered: Booking[] = bookingInfo;
        if (startDate && endDate) {
            filtered = bookingInfo.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return bookingStartDate >= startDate && bookingEndDate <= endDate && bookingEndDate > startDate;
            });
        }
        setFilteredBookings(filtered);
    };

    useEffect(() => {
        setFilteredBookings(bookingInfo);
    }, [bookingInfo]);

    return (
        <section className="p-4">
            <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
            <table className="table table-bordered table-hover shadow">
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Booking ID</th>
                        <th>Activity ID</th>
                        <th>Activity Type</th>
                        <th>Check-In Date</th>
                        <th>Check-Out Date</th>
                        <th>Guest Name</th>
                        <th>Guest Email</th>
                        <th>Adults</th>
                        <th>Children</th>
                        <th>Total Guest</th>
                        <th>Confirmation Code</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {filteredBookings.map((booking, index) => (
                        <tr key={booking.id}>
                            <td>{index + 1}</td>
                            <td>{booking.id}</td>
                            <td>{booking.activity.id}</td>
                            <td>{booking.activity.activityType}</td>
                            <td>{booking.checkInDate}</td>
                            <td>{booking.checkOutDate}</td>
                            <td>{booking.guestName}</td>
                            <td>{booking.guestEmail}</td>
                            <td>{booking.numOfAdults}</td>
                            <td>{booking.numOfChildren}</td>
                            <td>{booking.totalNumOfGuests}</td>
                            <td>{booking.bookingConfirmationCode}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleBookingCancellation(booking.id)}>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredBookings.length === 0 && <p>No booking found for the selected dates</p>}
        </section>
    );
};

export default BookingsTable;
