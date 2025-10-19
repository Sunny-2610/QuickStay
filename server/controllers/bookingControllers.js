import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of rooms 
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // Validate required fields
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: room, checkInDate, checkOutDate, guests" 
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-in date cannot be in the past" 
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-out date must be after check-in date" 
      });
    }

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: "Room is not available for the selected dates" 
      });
    }

    // get total price from Room
    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }

    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to create booking" 
    });
  }
};

// API to get all bookings for user 
// GET /api/booking/user
export const getUserbookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = (await Booking.find({ user }).populate("room hotel")).sort({
      createdAt: -1,
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch booking" });
  }
};

// API to get all bookings for hotel owner
export const getHotelbookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" });
    }

    const bookings = (
      await Booking.find({ hotel: hotel._id }).populate("room hotel user")
    ).sort({ createdAt: -1 });

    // Total Bookings
    const totalBookings = bookings.length;

    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};
