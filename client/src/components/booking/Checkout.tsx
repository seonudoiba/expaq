import { useEffect, useState } from "react"
import BookingForm from "./BookingForm"
import {
	FaUtensils,
	FaWifi,
	FaTv,
	FaWineGlassAlt,
	FaParking,
	FaCar,
	FaTshirt
} from "react-icons/fa"

import { useParams } from "react-router-dom"
import { getActivityById } from "../../utils/apiFunctions";
//import ActivityCarousel from "../common/ActivityCarousel"

const Checkout = () => {
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [activityInfo, setActivityInfo] = useState({
		photo: "",
		activityType: "",
		price: ""
	})

	const { activityId } = useParams()

	useEffect(() => {
		setTimeout(() => {
			getActivityById(activityId ?? "")
				.then((response) => {
					setActivityInfo(response)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error)
					setIsLoading(false)
				})
		}, 1000)
	}, [activityId])

	return (
		<div>
			<section className="container">
				<div className="row">
					<div className="col-md-4 mt-5 mb-5">
						{isLoading ? (
							<p>Loading activity information...</p>
						) : error ? (
							<p>{error}</p>
						) : (
							<div className="activity-info">
								<img
									src={`data:image/png;base64,${activityInfo.photo}`}
									alt="Activity photo"
									style={{ width: "100%", height: "200px" }}
								/>
								<table className="table table-bordered">
									<tbody>
										<tr>
											<th>Activity Type:</th>
											<td>{activityInfo.activityType}</td>
										</tr>
										<tr>
											<th>Price per night:</th>
											<td>${activityInfo.price}</td>
										</tr>
										<tr>
											<th>Activity Service:</th>
											<td>
												<ul className="list-unstyled">
													<li>
														<FaWifi /> Wifi
													</li>
													<li>
														<FaTv /> Netfilx Premium
													</li>
													<li>
														<FaUtensils /> Breakfast
													</li>
													<li>
														<FaWineGlassAlt /> Mini bar refreshment
													</li>
													<li>
														<FaCar /> Car Service
													</li>
													<li>
														<FaParking /> Parking Space
													</li>
													<li>
														<FaTshirt /> Laundry
													</li>
												</ul>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
					</div>
					<div className="col-md-8">
						<BookingForm />
					</div>
				</div>
			</section>
			{/* <div className="container">
				<ActivityCarousel />
			</div> */}
		</div>
	)
}
export default Checkout
