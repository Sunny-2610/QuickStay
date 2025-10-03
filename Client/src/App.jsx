import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div className="min-h-screen flex flex-col">
      {!isOwnerPath && <Navbar />}
         { false && <HotelReg /> }
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ‼️  specific route FIRST  */}
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms" element={<AllRooms />} />
                    <Route path="/my-bookings" element={<MyBookings />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;