export default interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    capacity: number;
    price: string;
    photo: string;
    bookings: number;
    hostName: string;
    activityType: string;
    booked: boolean;
}