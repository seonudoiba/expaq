import { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Props } from "../../types/booking";



const BookingSummary: React.FC<Props> = ({ booking, payment, isFormValid, onConfirm }) => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const numberOfDays = checkOutDate.diff(checkInDate, "days");
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const navigate = useNavigate();

    const handleConfirmBooking = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            setIsBookingConfirmed(true);
            onConfirm();
        }, 3000);
    };

    useEffect(() => {
        if (isBookingConfirmed) {
            navigate("/booking-success");
        }
    }, [isBookingConfirmed, navigate]);

    return (
        <div className="row">
            <div className="col-md-6"></div>
            <div className="card card-body mt-5">
                <h4 className="card-title hotel-color">Reservation Summary</h4>
                <p>
                    Name: <strong>{booking.guestFullName}</strong>
                </p>
                <p>
                    Email: <strong>{booking.guestEmail}</strong>
                </p>
                <p>
                    Check-in Date: <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
                </p>
                <p>
                    Check-out Date: <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
                </p>
                <p>
                    Number of Days Booked: <strong>{numberOfDays}</strong>
                </p>

                <div>
                    <h5 className="hotel-color">Number of Guest</h5>
                    <strong>
                        Adult{parseInt(booking.numOfAdults) > 1 ? "s" : ""} : {booking.numOfAdults}
                    </strong>
                    <strong>
                        <p>Children : {booking.numOfChildren}</p>
                    </strong>
                </div>

                {payment > 0 ? (
                    <>
                        <p>
                            Total payment: <strong>${payment}</strong>
                        </p>

                        {isFormValid && !isBookingConfirmed ? (
                            <button
                                className="btn btn-success"
                                onClick={handleConfirmBooking}
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm mr-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Booking Confirmed, redirecting to payment...
                                    </>
                                ) : (
                                    "Confirm Booking & proceed to payment"
                                )}
                            </button>
                        ) : isBookingConfirmed ? (
                            <div className="flex justify-center items-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p className="text-danger">Check-out date must be after check-in date.</p>
                )}
            </div>
        </div>
    );
};

export default BookingSummary;