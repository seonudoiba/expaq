
import ActivitySearch from '../common/ActivitySearch'
import TypeSlider from '../common/TypeSlider'
// import ActivityTypes from '../Home/ActivityTypes'
import Featured from '../Home/Featured'
import Hero from '../Home/Hero'
import TypesCarousel from '../Home/TypesCarossel'
// import HowItWorks from '../Home/HowItWorks'

const Home = () => {
  return (
    <div>
        <Hero/>
        <ActivitySearch/>
      {/* <ActivityTypes /> */}
      <TypeSlider/>
      <TypesCarousel/>
      <Featured />
      {/* <HowItWorks /> */}
    </div>
  )
}

export default Home