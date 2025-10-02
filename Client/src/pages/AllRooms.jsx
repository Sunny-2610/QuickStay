// src/pages/AllRooms.jsx
import React, { useState } from 'react';
import { roomsDummyData, facilityIcons } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';

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
  const navigate = useNavigate();

  /* ---- filter state ---- */
  const [showFilters, setShowFilters] = useState(false);   // mobile toggle
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const roomTypes   = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
  const priceRanges = ['0-500', '500-1000', '1000-1500', '2000-3000'];
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

  /* ---- filtered & sorted ---- */
  let filtered = roomsDummyData.filter(r => {
    if (selectedRooms.length && !selectedRooms.includes(r.roomType)) return false;
    if (selectedPrice.length) {
      const inRange = selectedPrice.some(range => {
        const [min, max] = range.split('-').map(Number);
        return r.pricePerNight >= min && r.pricePerNight <= max;
      });
      if (!inRange) return false;
    }
    return true;
  });

  if (sortBy === 'Price - Low to High')  filtered = [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sortBy === 'Price - High to Low')  filtered = [...filtered].sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sortBy === 'Newest First')         filtered = [...filtered].reverse();

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
              <span onClick={clearAll} className="text-xs underline cursor-pointer">CLEAR</span>
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
                <CheckBox key={p} label={`$ ${p}`} selected={selectedPrice.includes(p)} onChange={togglePrice} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((s) => (
                <RadioButton key={s} label={s} selected={sortBy === s} onChange={handleSort} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP two-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
        {/* cards column */}
        <div className="sm:col-span-2 flex flex-col gap-6">
          {filtered.map((room) => (
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
          ))}
        </div>

        {/* desktop sticky panel */}
        <aside className="hidden sm:block">
          <div className="sticky top-20 bg-white border border-gray-300 rounded-xl p-4 w-full sm:w-80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">FILTERS</p>
              <span onClick={clearAll} className="text-xs underline cursor-pointer">CLEAR</span>
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
                <CheckBox key={p} label={`$ ${p}`} selected={selectedPrice.includes(p)} onChange={togglePrice} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((s) => (
                <RadioButton key={s} label={s} selected={sortBy === s} onChange={handleSort} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllRooms;