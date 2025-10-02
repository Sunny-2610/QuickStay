import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div className="min-h-screen flex flex-col">
      {!isOwnerPath && <Navbar />}

      {/* this area expands so footer is pushed to bottom */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;