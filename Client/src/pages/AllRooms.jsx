import React from 'react'
import { roomCommonData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating';

const AllRoomas = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 px-4 md:px-16 lg:px-24'>
      
      <div className='flex flex-col items-start text-left'>
        <h1 className='font-playfair text-4xl md:text-[40px]'>
          Hotels Rooms
        </h1>
        <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-md">
          Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories
        </p>
      </div> 

      <div>
        {roomCommonData.map((room) => (
          <div key={room._id}>
            <img 
              onClick={() => navigate(`/rooms/${room._id}`)} 
              src={room.images?.[0] || room.image?.[0] || ""} 
              alt="hotel-img" 
              title='View Room Details' 
              className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' 
            />
            <div>
              <p>{room.hotel?.city || "Unknown City"}</p>
              <p>{room.hotel?.name || "Unknown Hotel"}</p>
              <div className='flex items-center'>
                <StarRating />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div></div>
    </div>
  )
}

export default AllRoomas
