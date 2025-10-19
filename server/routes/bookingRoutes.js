import express from "express"
import { createBooking, getHotelbookings, getUserbookings, checkAvailabilityAPI } from "../controllers/bookingControllers.js";
import { protect } from "../middleware/authMiddleware.js";
const bookingRouter = express.Router();


bookingRouter.post('/check-availability', checkAvailabilityAPI)
bookingRouter.post('/book',protect, createBooking)
bookingRouter.get('/user', protect, getUserbookings)
bookingRouter.get('/hotel',protect, getHotelbookings)
bookingRouter.get('/owner-dashboard', protect, getHotelbookings)

export default bookingRouter;