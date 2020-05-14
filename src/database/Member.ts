import mongoose from "mongoose";

const Member = new mongoose.Schema({

    id: { type: String },
    guildId: {type: String},
    xp: {type: Number, default: 0},
    level: {type: Number, default: 1},
    messages: { type: Number, default: 0},
    characters: {type: Number, default: 0},
    cash: {type: Number, default: 0},
    work_time: {type: Number, default: 0},
    rob_time: {type: Number, default: 0},
    daily_time: {type: Number, default: 0},
    weekly_time: {type: Number, default: 0},
    server_blacklisted: { type: Boolean, default: false },

})

export default mongoose.model("Member", Member);;