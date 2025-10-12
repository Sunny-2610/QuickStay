import Hotel from "../models/Hotel.js"
import User from "../models/User.js"

export const registerHotel = async (req , res) => {
    try {
const {name, address, contacts, city} = req.body;
const owner = req.used._id

//Check if User Already registered
const hotel = await Hotel.findOne({owner})
if(hotel) {
    return res.json({success: false, message: "Hotel Already registered"})

}
await Hotel.create({name , address, contacts, city , owner});

await userRouter.findByIdAndUpdate(owner, {role: "hotelOwner"});

res.json({success: true, message: "Hotel Registered Sucessfully "})


    } catch (error) {
        res.json({succees: false, message: error.message })
    }
}