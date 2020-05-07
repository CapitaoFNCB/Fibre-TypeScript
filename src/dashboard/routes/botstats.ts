import express from "express";
import CheckAuth from "../auth/CheckAuth"
const router = express.Router();
import { dashboard } from "../../utils/Config";
import os from "os";
import OSUtils, { NetStatMetrics } from "node-os-utils";

router.get("/", CheckAuth, async(req, res) => {

    const net = (await OSUtils.netstat.inOut()) as NetStatMetrics,
    cpu: number = await OSUtils.cpu.usage()

    res.render("botstats", {
        user: req.userInfos,
        bot: req.client,
        guilds: await req.client.shard.fetchClientValues('guilds.cache.size'),
        users: await req.client.shard.fetchClientValues('users.cache.size'),
        music: await req.client.shard.fetchClientValues('manager.players.size'),
        memory: await req.client.shard.broadcastEval('process.memoryUsage().heapUsed / 1024 / 1024 / 1024'),
        pversion: process.version,
        djsversion: require("discord.js").version,
        akversion: require("discord-akairo").version,
        cpus: os.cpus().length,
        cpumodel: os.cpus()[0].model,
        totalmem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        vpsos: `${req.client.capitalize(os.platform())} (${os.arch()}) `,
        cpuusage: `${cpu == 0 ? "0.1" : cpu}%`,
        network: `${net.total ? net.total.outputMb : "On Windows rn"} ⬆️ / ${net.total ? net.total.inputMb : "On Windows rn"} ⬇️` ,
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});


module.exports = router;