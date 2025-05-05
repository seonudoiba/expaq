import CarouselBooking from "./components/CarouselBooking";
import About from "./components/About";
import Features from "./components/Features";
import Destinations from "./components/Destinations";
import Activities from "./components/Activities";
import Services from "./components/Services";
import Registration from "./components/Registration";
import Testimonial from "./components/Testimonial";
import Hosts from "./components/Hosts";
import Blog from "./components/Blog";
export default function Home() {
  return (
    <>
    <CarouselBooking/>
    <About/>
    <Features/>
    <Destinations/>
    <Services/>
    <Activities/>
    <Registration/>
    <Hosts/>
    <Testimonial />
    <Blog/>
    </>
  );
}
