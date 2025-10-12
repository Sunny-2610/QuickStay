import mongoose from "mongoose"
const hotelschema = new mongoose.Schema({
    
    name: { type: "string", required: true },
    address: { type: "string", required: true },
    contact: { type: "string", required: true },
    owner: { type: "string", required: true },
    city: { type: "string", required: true, ref: "User" },


}, { timestamps: true });


const Hotel = mongoose.model("Hotel", hotelschema)

export default Hotel;