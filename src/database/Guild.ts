import mongoose from "mongoose";

const Guild = new mongoose.Schema({

    id: { type: String },
    prefix: { type: String, default: "+"},
    level: { type: Boolean, default: false},
    jackpot: { type: Number, default: 0},
    skip_users: { type: Array, default: [] },
    last_playing: { type: String, default: "" },
    notifications: { type: Boolean, default: true }

})
export default mongoose.model("Guild", Guild);