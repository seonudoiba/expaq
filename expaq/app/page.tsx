import Hero from "./components/Hero";
import Slider from "./components/Slider";
import TopActivities from "./components/TopActivities";
import TypesCarossel from "./components/TypesCarossel";
import TypesCarousel from "./components/TypesCarossel";

export default function Home() {
  
const slides = [
  { image: '/img1.jpg', title: 'Category 1' },
  { image: '/img2.jpg', title: 'Category 2' },
  { image: '/img3.jpg', title: 'Category 3' },
  { image: '/img1.jpg', title: 'Category 1' },
  { image: '/img2.jpg', title: 'Category 2' },
  { image: '/img3.jpg', title: 'Category 3' },
  // Add more slides as needed
];
  return (
    <div>
          {/* hero */}
          <Hero />
          <TypesCarossel slides={slides}/>

    </div>
  );
}
