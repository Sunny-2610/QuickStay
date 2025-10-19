import axios from "axios";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {useUser, useAuth} from "@clerk/clerk-react"
import { useState } from "react";
import {toast} from 'react-hot-toast'
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
   const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const {user} = useUser();
  const {getToken} = useAuth();
   
const [isOwner, setIsOwner] = useState(false);
const [showHotelReg, setShowHotelReg] = useState(false);
const [searchedcities, setSearchedCities] = useState([])
const [rooms, setRooms] = useState([])

//fetching Rooms from database
const fetchRooms = async () => {
  try {
    const { data } = await axios.get('/api/rooms');
    if(data.success) {
      setRooms(data.rooms);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}


// Fetching the user 
    const fetchUser = async( ) => {
        try {
            const {data} = await axios.get("/api/user", {headers: {Authorization: `Bearer ${await getToken()}`}});
            if (data.success) {
                setIsOwner(data.role === "hotelOwner")
                setSearchedCities(data.recentSearchedCities)
            }  else{
                //retry fetching user details after 5 seconds
                setTimeout(() => {
                    fetchUser()
                }, 5000)
            }



        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if(user) {
            fetchUser()
        }
    }, [user])     

    useEffect(() => {
      fetchRooms();
    }, []);

     

  const value = {
    currency, navigate, user, getToken, isOwner, setIsOwner, showHotelReg, setShowHotelReg ,axios,searchedcities, setSearchedCities, rooms ,setRooms
  }; // put your context data or functions here

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
