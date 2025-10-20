// RecommendedHotel.jsx
import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useAppContext } from '../context/AppContext';

const RecommendedHotel = () => {
  const { rooms, searchedcities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = () => {
    // If user has searched cities, show hotels from those cities
    if (searchedcities && searchedcities.length > 0) {
      const filteredHotels = rooms
        .slice()
        .filter((room) => searchedcities.includes(room.hotel.city));
      setRecommended(filteredHotels);
    } else {
      // Otherwise, show all rooms (featured hotels as recommended)
      setRecommended(rooms.slice(0, 4));
    }
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchedcities]);

  return (
    recommended.length > 0 && (
      <div className='max-w-6xl mx-auto px-4 md:px-8 py-8 mt-12 md:mt-20'>
        <Title
          title={searchedcities?.length > 0 ? 'Recommended Hotels' : 'Popular Hotels'}
          subtitle={
            searchedcities?.length > 0
              ? 'Based on your recent searches'
              : 'Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
          }
        />

        {/* 1 col default, 2 md, 4 lg */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
    )
  );
};

export default RecommendedHotel;