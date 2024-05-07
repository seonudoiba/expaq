import { useState } from "react"
import {Button } from "react-bootstrap"
import moment from "moment"
import { getAvailableActivities } from "../../utils/apiFunctions";
// import ActivitySearchResults from "./ActivitySearchResult"
// import ActivityTypeSelector from "./ActivityTypeSelector"
import SearchActivityTypeSelector from "./SearchActivityTypeSelector"

const ActivitySearch = () => {
	const [searchQuery, setSearchQuery] = useState({
		checkInDate: "",
		checkOutDate: "",
		activityType: ""
	})

	const [errorMessage, setErrorMessage] = useState("")
	const [availableActivities, setAvailableActivities] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	console.log(errorMessage, availableActivities, isLoading)

	const handleSearch = (e: any) => {
		e.preventDefault()
		const checkInMoment = moment(searchQuery.checkInDate)
		const checkOutMoment = moment(searchQuery.checkOutDate)
		if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
			setErrorMessage("Please enter valid dates")
			return
		}
		if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
			setErrorMessage("Check-out date must be after check-in date")
			return
		}
		setIsLoading(true)
		getAvailableActivities(new Date(Date.parse(searchQuery.checkInDate)), new Date(Date.parse(searchQuery.checkOutDate)), searchQuery.activityType)
			.then((response) => {
				setAvailableActivities(response.data)
				setTimeout(() => setIsLoading(false), 2000)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const handleInputChange = (e: any) => {
		const { name, value } = e.target
		setSearchQuery({ ...searchQuery, [name]: value })
		const checkInDate = moment(searchQuery.checkInDate)
		const checkOutDate = moment(searchQuery.checkOutDate)
		if (checkInDate.isValid() && checkOutDate.isValid()) {
			setErrorMessage("")
		}
	}
	const handleClearSearch = () => {
		setSearchQuery({
			checkInDate: "",
			checkOutDate: "",
			activityType: ""
		})
		setAvailableActivities([])
	}

	return (
		<>
			{/* <Container className="shadow mt-n5 mb-5 py-5">
				<div onSubmit={handleSearch}>
					<div className="justify-content-center">
						<div>
							<div controlId="checkInDate">
								<div>Check-in Date</div>
								<input
									type="date"
									name="checkInDate"
									value={searchQuery.checkInDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</div>
						</div>
						<div>
							<div controlId="checkOutDate">
								<div>Check-out Date</div>
								<input
									type="date"
									name="checkOutDate"
									value={searchQuery.checkOutDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</div>
						</div>
						<div>
							<div controlId="activityType">
								<div>Activity Type</div>
								<div className="d-flex">
									<ActivityTypeSelector
										handleActivityInputChange={handleInputChange}
										newActivity={searchQuery}
									/>
									<Button variant="secondary" type="submit" className="ml-2">
										Search
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{isLoading ? (
					<p className="mt-4">Finding availble activities....</p>
				) : availableActivities ? (
					<ActivitySearchResults results={availableActivities} onClearSearch={handleClearSearch} />
				) : (
					<p className="mt-4">No activities available for the selected dates and activity type.</p>
				)}
				{errorMessage && <p className="text-danger">{errorMessage}</p>}
			</Container> */}

			<div  >
				<div className='flex  items-center justify-center' onSubmit={handleSearch}>
					<div className="category grid grid-cols-2 bg-yellow-400 gap-2 w-[90vw] absolute h-[12rem] rounded-lg  items-center justify-around">

						<div className="flex justify-center items-center  h-full w-full ">
								<div className="">
								<div className="text-xl text-center text-white">Check-in Date:</div>
								<input
									className="rounded-l-lg text-center border-0 right-0 w-full h-16 md:w-72"
									type="date"
									name="checkInDate"
									value={searchQuery.checkInDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
								</div>
								
								<div >
									<div className="text-xl text-center text-white">Check-out Date:</div>
									<input
										className="rounded-r-lg text-center border-0 left-0 w-full h-16 md:w-64"
										type="date"
										name="checkOutDate"
										value={searchQuery.checkOutDate}
										onChange={handleInputChange}
										min={moment().format("YYYY-MM-DD")}
									/>
								</div>
						</div>

						<div className="flex justify-center items-center gap-2 h-full w-full ">
							<div >
								<div className="text-xl text-center text-white">Activity Type</div>
								<SearchActivityTypeSelector handleActivityInputChange={handleInputChange}
									newActivity={searchQuery} />

							</div>
							<div className=" ">
							<div className="text-xl text-yellow-400">clear</div>
							<Button type="submit" className="bg-red-200 rounded-lg  border-0 left-0 h-16 w-24" onClick={handleClearSearch}>
								Clear
							</Button>
						</div>
						</div>
						



					</div>
				</div>
			</div>
		</>
	)
}

export default ActivitySearch
