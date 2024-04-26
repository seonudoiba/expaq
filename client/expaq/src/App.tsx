import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from "./components/auth/Login"
import Registration from './components/auth/Registration';
import Profile from './components/auth/Profile';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import AddActivities from './components/pages/AddActivities';
import ActivityListing from './components/pages/ActivityListing';
import EditActivity from "./components/activities/EditActivity"
import ExistingActivities from './components/activities/ExistingActivities';
import RequireAuth from './components/auth/RequireAuth';
import Checkout from './components/booking/Checkout';
import Admin from './components/admin/Admin';
import BookingSuccess from './components/booking/BookingSuccess';
import Bookings from './components/booking/Bookings';
import FindBooking from './components/booking/FindBooking';
import { useLocation } from 'react-router-dom';

function App() {
  
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-activity" element={<AddActivities />} />
          <Route path="/activities" element={<ActivityListing />}/>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} /> */}

          <Route path="/edit-activity/:activityId" element={<EditActivity/>} />
          <Route path="/existing-activities" element={<ExistingActivities />} />
          
          <Route
            path="/book-activity/:activityId"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/existing-bookings" element={<Bookings />} />
          <Route path="/find-booking" element={<FindBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<FindBooking />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
