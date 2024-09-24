import React from 'react'
import AppNearby from './AppNearby'
import AppSection from './AppSection'

const Categories = () => {
  return (
    <div>
       <AppSection
          title="Explore Nearby"
          className="grid grid-cols-2 lg:gap-x-4 gap-x-1 gap-y-2 sm:grid-cols-3 lg:grid-cols-4"
        >
            {/* <AppNearby key={index} data={data} /> */}
        </AppSection>
    </div>
  )
}

export default Categories
