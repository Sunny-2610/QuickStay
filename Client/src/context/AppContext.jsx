// Client/src/context/AppContext.jsx
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetching Rooms from database
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms');
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
    }
  };

  // Fetching the user 
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setUserData(data);
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        // Retry fetching user details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  // Store recent searched city
  const storeRecentSearch = async (city) => {
    try {
      await axios.post('/api/user/store-recent-search', 
        { recentSearchedCity: city },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      
      // Update local state
      setSearchedCities(prev => {
        const updated = [...prev, city];
        // Keep only last 3 unique cities
        const uniqueCities = [...new Set(updated)];
        return uniqueCities.slice(-3);
      });
    } catch (error) {
      console.error("Error storing recent search:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user: userData,
    getToken,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    axios,
    searchedCities,
    setSearchedCities,
    storeRecentSearch,
    rooms,
    setRooms,
    fetchRooms
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};