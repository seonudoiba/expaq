// import { useContext } from "react"
// import { AuthContext } from "./AuthProvider"
import { Link, useNavigate } from "react-router-dom"
import { FaUser } from 'react-icons/fa'
import { useEffect, useState } from "react";


const Logout = () => {
	// const auth = useContext(AuthContext)
	const navigate = useNavigate()

	const [userInfo, setUserInfo] = useState<{ userId: string; userRole: string }>({ userId: '', userRole: '' });

    useEffect(() => {
        // Retrieve user information from localStorage
        const userId = localStorage.getItem("userId") as string;
        const userRole = localStorage.getItem("userRole") as string;

        // Set user information into the userInfo state
        setUserInfo({ userId, userRole });
    }, [userInfo.userId, userInfo.userRole]);


	const handleLogout = () => {
		// auth.handleLogout()
		localStorage.removeItem("userId");
		localStorage.removeItem("userRole");
		localStorage.removeItem("token");
		//     setUser(null);
		navigate("/", { state: { message: " You have been logged out!" } })
	}
	console.log(userInfo)

	return (
		<>
			<Link className='flex cursor-pointer justify-center items-center gap-2 text-sm' to='/'>
				<span><FaUser /></span>
				<span>{userInfo.userId ? userInfo.userId.split("@")[0] : ''}</span>
			</Link>
			<hr className="dropdown-divider" />
			<Link className='flex cursor-pointer justify-center items-center gap-2 text-sm' to='/'>
			<button className="dropdown-item" onClick={handleLogout}>
				Logout
			</button>
			</Link>
		</>
	)
}

export default Logout
