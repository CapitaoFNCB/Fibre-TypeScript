import mongoose from "mongoose";

const Guild = new mongoose.Schema({

    id: { type: String },
    prefix: { type: String, default: "+"},
    level: { type: Boolean, default: false},
    jackpot: { type: Number, default: 0},
    skip_users: { type: Array, default: [] },
    last_playing: { type: String, default: "" },
    notifications: { type: Boolean, default: true },
    customCommands: { type: Array, default: [] },
    colour: { type: String, default: "0491e2" },
    modlogs: { type: Object, default: { enabled: false, channel: null } },
    musicChannel: { type: Object, default: { enabled: false, channel: null } },
    commandChannel: { type: Object, default: { enabled: false, channel: null } },
    djRole: { type: String, default: null },
    volume: { type: Number, default: 100 },
    tickets: { type: Boolean, default: false },

})
export default mongoose.model("Guild", Guild);