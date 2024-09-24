import Hero from "./components/Hero";
// import TopActivities from "./components/TopActivities";
import CarouselSpacing from "./components/carousel"

export default function Home() {
  
// const slides = [
//   { image: '/img1.jpg', title: 'Category 1' },
//   { image: '/img2.jpg', title: 'Category 2' },
//   { image: '/img3.jpg', title: 'Category 3' },
//   { image: '/img1.jpg', title: 'Category 1' },
//   { image: '/img2.jpg', title: 'Category 2' },
//   { image: '/img3.jpg', title: 'Category 3' },
//   // Add more slides as needed
// ];
  return (
    <div>
          {/* hero */}
          <Hero />
          <CarouselSpacing/>

    </div>
  );
}
