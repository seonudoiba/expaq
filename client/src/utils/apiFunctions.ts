import axios, { AxiosResponse } from 'axios';
import { Activity, ActivityResponse } from '../types/activity';


interface Login {
    email: string;
    password: string;
}
interface Registration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const api = axios.create({
  baseURL: "http://localhost:8080/"
});
export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}
// Function to add activities
export async function addActivity(photo: File, activityType: string, price: number): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("activityType", activityType);
    formData.append("price", price.toString());

    const response = await api.post("/activities/add/new-activities", formData, {
      headers: getHeader()
    });

    if (response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error adding activity:", error);
    return false;
  }
}

// Function to get all activity types
export async function getActivityTypes(): Promise<string[]> {
  try {
    
    const response = await api.get("/activities/activity/types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching activity types");
  }
}

// Function to get all activities
export async function getAllActivities(): Promise<ActivityResponse[]> {
  try {
    const response = await api.get("/activities/");
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw new Error("Error fetching activities");
  }
}

/* This function deletes a activity by the Id */
export async function deleteActivity(activityId: string): Promise<AxiosResponse> {
	try {
		const result = await api.delete(`/activities/delete/activity/${activityId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error: any) {
		throw new Error(`Error deleting activity ${error.message}`)
	}
}
/* This function update a activity */
export async function updateActivity(activityId:string, activityData:Activity) {
	const formData = new FormData()
	formData.append("activityType", activityData.activityType)
	formData.append("price", activityData.price.toString())
	formData.append("photo", activityData.photo.toString())
	const response = await api.put(`/activities/update/${activityId}`, formData,{
		headers: getHeader()
	})
	return response
}

/* This funcction gets a activity by the id */
export async function getActivityById(activityId: string) {
	try {
		const result = await api.get(`/activities/activity/${activityId}`)
		return result.data
	} catch (error: any) {
		throw new Error(`Error fetching activity ${error.message}`)
	}
}

/* This function saves a new booking to the databse */
export async function bookActivity(activityId: string, booking: any) {
	try {
		const response = await api.post(`/bookings/activity/${activityId}/booking`, booking)
		return response.data
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking activity : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: getHeader()
		})
		return result.data
	} catch (error: any) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode: string) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error:any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId: string) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error: any) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

/* This function gets all availavle activities from the database with a given date and a activity type */
export async function getAvailableActivities(checkInDate: Date, checkOutDate: Date , activityType: string) {
	const result = await api.get(
		`activities/available-activities?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&activityType=${activityType}`
	)
	return result
}


/* This function register a new user */
export async function registerUser(registration: Registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error: any) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

/* This function login a registered user */
export async function loginUser(login: Login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/*  This is function to get the user profile */
export async function getUserProfile(userId: string , token: string) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This isthe function to delete a user */
export async function deleteUser(userId: string ) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error: any) {
		return error.message;
	}
	
}

/* This is the function to get a single user */
export async function getUser(userId: string, token:string) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId: string | string, token: string) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error: any) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}
