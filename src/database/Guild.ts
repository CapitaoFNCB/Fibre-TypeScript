import mongoose from "mongoose";

const Guild = new mongoose.Schema({

    id: { type: String },
    prefix: { type: String, default: "+"},
    level: { type: Boolean, default: false}

})

export default mongoose.model("Guild", Guild);