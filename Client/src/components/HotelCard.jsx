import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room, index}) => {
  return (
    <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0,0)} key={room._id} className='block'>
      <div className='relative max-w-sm w-full rounded-xl overflow-hidden bg-white text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300'>
        <img src={room.images[0]} alt="" className='w-full h-48 object-cover'/>
        {index % 2 === 0 && (
          <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>
            Best Seller
          </p>
        )}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-2'>
            <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
            <div className='flex items-center gap-1 text-sm'>
              <img src={assets.starIconFilled} alt="star-icon" className='h-4 w-4'/> 
              <span>4.5</span>
            </div>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-600 mb-3'>
            <img src={assets.locationIcon} alt="location-icon" className='h-4 w-4'/>
            <span>{room.hotel.address}</span>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <p className='text-xl text-gray-800 font-semibold'>${room.pricePerNight}<span className='text-sm font-normal text-gray-600'>/night</span></p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer hover:border-gray-400'>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard