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
const CheckAuth_1 = __importDefault(require("../auth/CheckAuth"));
const router = express_1.default.Router();
const Config_1 = require("../../utils/Config");
const os_1 = __importDefault(require("os"));
const node_os_utils_1 = __importDefault(require("node-os-utils"));
router.get("/", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const net = (yield node_os_utils_1.default.netstat.inOut()), cpu = yield node_os_utils_1.default.cpu.usage();
    res.render("botstats", {
        user: req.userInfos,
        bot: req.client,
        guilds: yield req.client.shard.fetchClientValues('guilds.cache.size'),
        users: yield req.client.shard.fetchClientValues('users.cache.size'),
        music: yield req.client.shard.fetchClientValues('manager.players.size'),
        memory: yield req.client.shard.broadcastEval('process.memoryUsage().heapUsed / 1024 / 1024 / 1024'),
        pversion: process.version,
        djsversion: require("discord.js").version,
        akversion: require("discord-akairo").version,
        cpus: os_1.default.cpus().length,
        cpumodel: os_1.default.cpus()[0].model,
        totalmem: (os_1.default.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        vpsos: `${req.client.capitalize(os_1.default.platform())} (${os_1.default.arch()}) `,
        cpuusage: `${cpu == 0 ? "0.1" : cpu}%`,
        network: `${net.total ? net.total.outputMb : "On Windows rn"} ⬆️ / ${net.total ? net.total.inputMb : "On Windows rn"} ⬇️`,
        currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
    });
}));
module.exports = router;
