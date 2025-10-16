import express from "express"
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getRooms, toggleRoomAvailability, getOwnerRooms } from "../controllers/roomControllers.js";



const roomRouter = express.Router();

// Run auth first so unauthenticated requests don't trigger multipart parsing
roomRouter.post ('/', protect, upload.array("images",4), createRoom )
roomRouter.get('/', getRooms)
roomRouter.get('/owner',protect, getOwnerRooms)
roomRouter.post('/toggle-availability', protect , toggleRoomAvailability)




export default roomRouter;