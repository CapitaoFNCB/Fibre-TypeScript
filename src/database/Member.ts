import mongoose from "mongoose";

const Member = new mongoose.Schema({

    id: { type: String },
    guildId: {type: String},
    xp: {type: Number, default: 0},
    level: {type: Number, default: 1},
    characters: {type: Number, default: 0},
    cash: {type: Number, default: 0},

})

export default mongoose.model("Member", Member);;