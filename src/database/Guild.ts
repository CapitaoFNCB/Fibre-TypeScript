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
    colour: { type: String, default: "#0491e2" },
    modlogs: { type: Object, default: { enabled: false, channel: null } },
    musicChannel: { type: Object, default: { enabled: false, channel: null } },
    commandChannel: { type: Object, default: { enabled: false, channel: null } },
    djRole: { type: String, default: null },
    volume: { type: Number, default: 100 },
    tickets: { type: Boolean, default: false },
    levelRoles: { type: Array, default: []},
    autoRole: { type: String, default: null },
    welcome: { type: Object, default: { enabled: false, channel: null, role: null } },
    vefify: { type: Boolean, default: false },
    levelCards: { type: Boolean, default: true },
    public_server: { type: Boolean, default: false },
    anit_raid: { type: Object, default: { enabled: false, protections: 0 } },
    anit_spam: { type: Object, default: { enabled: false, protections: 0 } },
    auto_mod: { type: Boolean, default: false }

})
export default mongoose.model("Guild", Guild);