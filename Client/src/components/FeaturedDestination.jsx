// FeaturedDestination.jsx
import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturedDestination = () => {
  const {rooms,navigate} = useAppContext()

   return rooms.length > 0 && (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 mt-12 md:mt-20">
      <Title 
        title={'Featured Destination'} 
        subtitle={'Explore our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'} 
      />
      
      {/* 1 col default, 2 md, 4 lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button  
        onClick={() => { 
          navigate('/rooms'); // ✅ fixed
          scrollTo(0,0); 
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300
        rounded bg-white hover:bg-gray-50 transition-all cursor-pointer mx-auto block"
      >
        View All Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination
