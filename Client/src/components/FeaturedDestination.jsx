// FeaturedDestination.jsx
import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'

const FeaturedDestination = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 mt-12 md:mt-20">
        <Title title={'Featured Destination'} subtitle={'Explore our handpicked selection of exceptional properties around the word, offering unparalled luxuary and unforgettable experince.'} />
      {/* 1 col default, 2 md, 4 lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roomsDummyData.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  )
}

export default FeaturedDestination