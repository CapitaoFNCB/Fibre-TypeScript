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
const is_hexcolor_1 = __importDefault(require("is-hexcolor"));
router.get("/:serverID", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let guildInfos = yield utils_1.default.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guildInfos || !req.userInfos.displayedGuilds || !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    }
    let player = yield req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').playing : ""`, true);
    let bands = yield req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').bands : ""`, true);
    let queue = yield req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').queue : ""`, true);
    res.render("manager/guild", {
        guild: guildInfos,
        user: req.userInfos,
        bot: req.client,
        player: player,
        bands: bands,
        queue: queue,
        currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
    });
}));
router.post("/:serverID", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let guild = yield utils_1.default.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guild || !req.userInfos.displayedGuilds || !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    }
    let guildData = yield req.client.guildsData.findOne({ id: guild.id });
    let data = req.body;
    let remove = Object.keys(data).map(x => x).filter(x => x.startsWith("deletecustomCommand"))[0] ? Object.keys(data).map(x => x).filter(x => x.startsWith("deletecustomCommand"))[0].split("_")[1] : "";
    let edit = Object.keys(data).map(x => x).filter(x => x.startsWith("editCustomCommand"))[0] ? Object.keys(data).map(x => x).filter(x => x.startsWith("editCustomCommand"))[0].split("_")[1] : "";
    if (data.text && data.reply && data.text.length < 10 && data.reply.length < 2000) {
        let commands = guildData.customCommands;
        let searching = commands.filter((c) => c.name === data.text);
        if (!searching.length && !req.client.commandHandler.modules.has(data.text)) {
            commands.push({
                name: data.text.split(" ").join(""),
                answer: data.reply,
                created: Date.now(),
                modified: Date.now(),
                creater: req.user.id,
                editor: req.user.id
            });
            guildData.customCommands = commands;
        }
    }
    else if (remove.length) {
        guildData.customCommands = guild.customCommands.filter((c) => c.name !== remove);
    }
    else if (edit.length) {
        const search = Object.values(data)[Object.keys(data).indexOf(`text_${edit}`)];
        let filtered = guildData.customCommands.filter((c) => c.name !== edit);
        let found = yield guildData.customCommands.filter((c) => c.name === edit);
        if (search.length) {
            filtered.push({
                name: found[0].name,
                answer: search,
                created: found[0].created,
                modified: Date.now(),
                creater: found[0].creater,
                editor: req.user.id
            });
            guildData.customCommands = filtered;
        }
    }
    if (data.prefix && (data.prefix.length > 0 && data.prefix.length <= 5)) {
        guildData.prefix = data.prefix;
    }
    if (data.colour) {
        if (data.colour[0]) {
            if (is_hexcolor_1.default(data.colour[0]))
                guildData.colour = data.colour[0];
        }
        else {
            if (is_hexcolor_1.default(data.colour[1]))
                guildData.colour = data.colour[1];
        }
    }
    guildData.save();
    req.client.broadcastEval(`this.guilds.cache.get('${req.params.serverID}') ? this.databaseCache.guilds.set('${req.params.serverID}', { prefix : "${guildData.prefix}", colour: "${guildData.colour}" }) : ""`);
    res.redirect(303, "/manage/" + guild.id);
}));
module.exports = router;
