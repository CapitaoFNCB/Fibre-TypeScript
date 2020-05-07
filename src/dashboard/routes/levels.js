"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = __importDefault(require("../utils"));
const CheckAuth_1 = __importDefault(require("../auth/CheckAuth"));
const router = express_1.default.Router();
const Config_1 = require("../../utils/Config");
router.get("/:serverID", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let guildInfos = yield utils_1.default.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guildInfos) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    }
    res.render("levels", {
        guild: guildInfos,
        levels: yield req.client.membersData.find({ guildId: guildInfos.id }).lean(),
        user: req.userInfos,
        bot: req.client,
        currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
    });
}));
router.post("/:serverID", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let guild = yield utils_1.default.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guild) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    }
    let data = req.body;
    if (Object.keys(data)[0]) {
        let save_data = yield req.client.membersData.findOne({ id: Object.keys(data)[0].split("_")[1], guildId: guild.id });
        save_data.level = 1;
        save_data.xp = 0;
        save_data.save();
    }
    res.redirect(303, "/levels/" + guild.id);
}));
module.exports = router;
