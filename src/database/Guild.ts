import mongoose from "mongoose";

const Guild = new mongoose.Schema({

    id: { type: String },
    prefix: { type: String, default: "+"},
    level: { type: Boolean, default: false},
    jackpot: { type: Number, default: 0}

})

export default mongoose.model("Guild", Guild);