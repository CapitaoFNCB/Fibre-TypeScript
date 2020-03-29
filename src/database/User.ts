import mongoose from "mongoose";

const User = new mongoose.Schema({

    id: { type: String },

})

export default mongoose.model("User", User);