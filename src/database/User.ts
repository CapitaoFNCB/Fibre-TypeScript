import mongoose from "mongoose";

let User = new mongoose.Schema({
    
        id: { type: String },
        backgound: { type: Buffer, default: ``},
        colour: { type: String, default: "#ffffff"},
        premium: { type: Boolean, default: false }
    
})

export default mongoose.model("User", User)