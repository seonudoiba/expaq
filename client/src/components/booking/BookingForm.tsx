import React, { useEffect, useState } from "react";
import moment from "moment";
import BookingSummary from "./BookingSummary";
import { bookActivity, getActivityById } from "../../utils/apiFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface Booking {
    guestFullName: string;
    guestEmail: string;
    checkInDate: string;
    checkOutDate: string;
    numOfAdults: string;
    numOfChildren: string;
}

const BookingForm: React.FC = () => {
    const [validated, setValidated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [price, setActivityPrice] = useState<number>(0);

    const currentUser = localStorage.getItem("userId");

    const [booking, setBooking] = useState<Booking>({
        guestFullName: "",
        guestEmail: currentUser || "",
        checkInDate: "",
        checkOutDate: "",
        numOfAdults: "",
        numOfChildren: "",
    });

    const { activityId } = useParams();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
        setErrorMessage("");
    };

    const getActivityPriceById = async (activityId: string) => {
        try {
            const response = await getActivityById(activityId);
            setActivityPrice(response.price);
        } catch (error: any) {
            throw new Error(error);
        }
    };

useEffect(() => {
	getActivityPriceById(activityId ?? "");
}, [activityId]);


    const isGuestCountValid = () => {
        const adultCount = parseInt(booking.numOfAdults);
        const childrenCount = parseInt(booking.numOfChildren);
        const totalCount = adultCount + childrenCount;
        return totalCount >= 1 && adultCount >= 1;
    };

    const isCheckOutDateValid = () => {
        if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
            setErrorMessage("Check-out date must be after check-in date");
            return false;
        } else {
            setErrorMessage("");
            return true;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
            e.stopPropagation();
        } else {
            setIsSubmitted(true);
        }
        setValidated(true);
    };

    const handleFormSubmit = async () => {
        try {
            const confirmationCode = await bookActivity(activityId ?? "", booking);
            setIsSubmitted(true);
            navigate("/booking-success", { state: { message: confirmationCode } });
        } catch (error: any) {
            const errorMessage = error.message;
            console.log(errorMessage);
            navigate("/booking-success", { state: { error: errorMessage } });
        }
    };
	const calculatePayment = () => {
		const checkInDate = moment(booking.checkInDate)
		const checkOutDate = moment(booking.checkOutDate)
		const diffInDays = checkOutDate.diff(checkInDate, "days")
		const paymentPerDay = price ? price : 0
		return diffInDays * paymentPerDay
	}

    return (
        <>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card card-body mt-5">
                            <h4 className="card-title">Reserve Activity</h4>

                            <form noValidate onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="guestFullName" className="hotel-color">
                                        Fullname
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        id="guestFullName"
                                        name="guestFullName"
                                        value={booking.guestFullName}
                                        placeholder="Enter your fullname"
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                    <div className="invalid-feedback">Please enter your fullname.</div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="guestEmail" className="hotel-color">
                                        Email
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        id="guestEmail"
                                        name="guestEmail"
                                        value={booking.guestEmail}
                                        placeholder="Enter your email"
                                        onChange={handleInputChange}
                                        disabled
                                        className="form-control"
                                    />
                                    <div className="invalid-feedback">Please enter a valid email address.</div>
                                </div>

                                <fieldset style={{ border: "2px" }}>
                                    <legend>Lodging Period</legend>
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="checkInDate" className="hotel-color">
                                                Check-in date
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                id="checkInDate"
                                                name="checkInDate"
                                                value={booking.checkInDate}
                                                placeholder="check-in-date"
                                                min={moment().format("YYYY-MM-DD")}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                            <div className="invalid-feedback">Please select a check in date.</div>
                                        </div>

                                        <div className="col-6">
                                            <label htmlFor="checkOutDate" className="hotel-color">
                                                Check-out date
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                id="checkOutDate"
                                                name="checkOutDate"
                                                value={booking.checkOutDate}
                                                placeholder="check-out-date"
                                                min={moment().format("YYYY-MM-DD")}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                            <div className="invalid-feedback">Please select a check out date.</div>
                                        </div>
                                        {errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
                                    </div>
                                </fieldset>

                                <fieldset style={{ border: "2px" }}>
                                    <legend>Number of Guest</legend>
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="numOfAdults" className="hotel-color">
                                                Adults
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                id="numOfAdults"
                                                name="numOfAdults"
                                                value={booking.numOfAdults}
                                                min={1}
                                                placeholder="0"
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                            <div className="invalid-feedback">Please select at least 1 adult.</div>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="numOfChildren" className="hotel-color">
                                                Children
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                id="numOfChildren"
                                                name="numOfChildren"
                                                value={booking.numOfChildren}
                                                placeholder="0"
                                                min={0}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                            <div className="invalid-feedback">Select 0 if no children</div>
                                        </div>
                                    </div>
                                </fieldset>

                                <div className="fom-group mt-2 mb-2">
                                    <button type="submit" className="btn btn-hotel">
                                        Continue
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-4">
                        {isSubmitted && (
                            <BookingSummary
                                booking={booking}
                                payment={calculatePayment()}
                                onConfirm={handleFormSubmit}
                                isFormValid={validated}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default BookingForm;
