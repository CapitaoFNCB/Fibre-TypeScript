import mongoose from "mongoose";

const User = new mongoose.Schema({

    id: { type: String },
    backgound: { type: String, default: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fuej6dnX54XA%2Fmaxresdefault.jpg&f=1&nofb=1"},
    colour: { type: String, default: "#ffffff"},
    opacity: { type: Number, default: 50 }

})

export default mongoose.model("User", User);