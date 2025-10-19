// src/pages/AllRooms.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { facilityIcons } from '../assets/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

/* ---------- reusable controls ---------- */
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

/* ---------- main page ---------- */
const AllRooms = () => {
  const [searchParams] = useSearchParams();
  const { axios, navigate, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState('');


  /* ---- filter state ---- */
  const [showFilters, setShowFilters] = useState(false);   // mobile toggle
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const roomTypes   = ['Single Bed', 'Double Bed', 'Luxury Bed', 'Family Suites'];
  const priceRanges = ['0-500', '500-1000', '1000-1500', '1500-2000', '2000+'];
  const sortOptions = ['Price - Low to High', 'Price - High to Low', 'Newest First'];

  /* ---- handlers ---- */
  const toggleRoom  = (checked, label) => setSelectedRooms(prev => checked ? [...prev, label] : prev.filter(r => r !== label));
  const togglePrice = (checked, label) => setSelectedPrice(prev => checked ? [...prev, label] : prev.filter(p => p !== label));
  const handleSort  = (_, label) => setSortBy(label);
  const clearAll    = () => { setSelectedRooms([]); setSelectedPrice([]); setSortBy(''); };

  /* ---- utils ---- */
  const amenityIcons = (amenities = []) =>
    amenities
      .map((a) => facilityIcons[a])
      .filter(Boolean)
      .slice(0, 3)
      .map((url, i) => <img key={i} src={url} alt="amenity" className="w-5 h-5" />);

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/rooms');
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Function to check if a room matches the selected room types
  const matchesRoomType = (room) => {
    return selectedRooms.length === 0 || selectedRooms.includes(room.roomType);
  };

  // Function to check if a room matches the selected price ranges
  const matchesPriceRange = (room) => {
    if (selectedPrice.length === 0) return true;
    
    return selectedPrice.some((range) => {
      if (range.includes('+')) {
        // Handle "2000+" case
        const min = parseInt(range.replace('+', ''));
        return room.pricePerNight >= min;
      } else {
        // Handle ranges like "0-500", "500-1000"
        const [min, max] = range.split('-').map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      }
    });
  };

  // Function to sort rooms based on the selected sort option
  const sortRooms = (a, b) => {
    if (selectedSort === 'Price - Low to High') {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === 'Price - High to Low') { 
      return b.pricePerNight - a.pricePerNight;
    }     
    if (selectedSort === 'Newest First') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };   

  // Filter Destinations
  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  // Filter and sort rooms based on the selected filters and sort options
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => 
      matchesRoomType(room) && 
      matchesPriceRange(room) &&
      filterDestination(room)
    ).sort(sortRooms);
  }, [rooms, selectedRooms, selectedPrice, selectedSort, searchParams]);

  // Clear All Filters
  const clearFilters = () => {
    setSelectedRooms([]);
    setSelectedPrice([]);
    setSortBy('');
    setSelectedSort('');
  };


  return (
    <div className="min-h-screen pt-28 px-4 md:px-16 lg:px-24">
      {/* heading */}
      <div className="w-full">
        <h1 className="font-playfair text-3xl md:text-4xl">Hotel Rooms</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Take advantage of our limited-time offers and special packages to
          enhance your stay and create unforgettable memories.
        </p>
      </div>

      {/* MOBILE – toggle + panel  (AT TOP)  */}
      <div className="sm:hidden mt-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>

        {showFilters && (
          <div className="mt-3 bg-white border border-gray-300 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm">FILTERS</p>
              <span onClick={clearFilters} className="text-xs underline cursor-pointer">CLEAR</span>
            </div>

            <div>
              <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
              {roomTypes.map((r) => (
                <CheckBox key={r} label={r} selected={selectedRooms.includes(r)} onChange={toggleRoom} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>
              {priceRanges.map((p) => (
                <CheckBox key={p} label={`$${p}`} selected={selectedPrice.includes(p)} onChange={togglePrice} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((s) => (
                <RadioButton key={s} label={s} selected={sortBy === s} onChange={(checked, label) => {
                  setSortBy(label);
                  setSelectedSort(label);
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP two-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
        {/* cards column */}
        <div className="sm:col-span-2 flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-8">Loading rooms...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No rooms found matching your criteria.</div>
          ) : (
            filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-5"
            >
              <div className="flex items-start gap-5">
                <img
                  src={room.images[0]}
                  alt={room.roomType}
                  className="w-24 h-24 rounded-xl object-cover cursor-pointer shrink-0"
                  onClick={() => navigate(`/rooms/${room._id}`)}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {room.hotel.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {room.hotel.city} · {room.roomType}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {amenityIcons(room.amenities)}
                  </div>

                  <div className="flex items-center gap-1 mt-2">
                    <StarRating rating={4.5} />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>

                {/* top-right price / View */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${room.pricePerNight}
                  </p>
                  <button
                    onClick={() => navigate(`/rooms/${room._id}`)}
                    className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* desktop sticky panel */}
        <aside className="hidden sm:block">
          <div className="sticky top-20 bg-white border border-gray-300 rounded-xl p-4 w-full sm:w-80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">FILTERS</p>
              <span onClick={clearFilters} className="text-xs underline cursor-pointer">CLEAR</span>
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
              {roomTypes.map((r) => (
                <CheckBox key={r} label={r} selected={selectedRooms.includes(r)} onChange={toggleRoom} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>
              {priceRanges.map((p) => (
                <CheckBox key={p} label={`$${p}`} selected={selectedPrice.includes(p)} onChange={togglePrice} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((s) => (
                <RadioButton key={s} label={s} selected={sortBy === s} onChange={(checked, label) => {
                  setSortBy(label);
                  setSelectedSort(label);
                }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllRooms;