export interface Booking {
    guestFullName: string;
    guestEmail: string;
    checkInDate: string;
    checkOutDate: string;
    numOfAdults: string;
    numOfChildren: string;
}

export interface Props {
    booking: Booking;
    payment: number;
    isFormValid: boolean;
    onConfirm: () => void;
}
export interface BookingInfo {
    id: string;
    bookingConfirmationCode: string;
    activity: { id: string; activityType: string };
    activityNumber: string;
    checkInDate: string;
    checkOutDate: string;
    guestName: string;
    guestEmail: string;
    numOfAdults: string;
    numOfChildren: string;
    totalNumOfGuests: string;
}
