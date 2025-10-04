import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div className="min-h-screen flex flex-col">
      {!isOwnerPath && <Navbar />}
      {false && <HotelReg />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ‼️  specific route FIRST  */}
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />


          </Route>

        </Routes>
      </main>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;