export interface Activity {
    photo: string | File;
    activityType: string;
    price: number;
  }
  export interface ActivityResponse {
    id: string;
    title: string;
    description: string;
    location: string;
    capacity: number;
    price: number;
    photo: string | File;
    bookings: number;
    hostName: string;
    activityType: string;
    booked: boolean;
    message?: string;
  }

  // Define the interface for the response data
// interface Activity {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   capacity: number;
//   price: number;
//   photo: string | File;
//   bookings: number;
//   hostName: string;
//   activityType: string;
//   booked: boolean;
// }
  