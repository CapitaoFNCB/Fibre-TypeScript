import express from "express";
import utils from "../utils";
import CheckAuth from "../auth/CheckAuth";
const router = express.Router();
import { dashboard } from "../../utils/Config";
import isHex from "is-hexcolor"

router.get("/:serverID", CheckAuth, async(req, res) => {

    let guildInfos = await utils.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guildInfos || !req.userInfos.displayedGuilds || !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    }
    let player = await req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').playing : ""`, true);
    let bands = await req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').bands : ""`, true);
    let queue = await req.client.broadcastEval(`this.manager.players.get('${req.params.serverID}') ? this.manager.players.get('${req.params.serverID}').queue : ""`, true);
    res.render("manager/guild", {
        guild: guildInfos,
        user: req.userInfos,
        bot: req.client,
        player: player,
        bands: bands,
        queue: queue,
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

router.post("/:serverID", CheckAuth, async(req, res) => {

    let guild = await utils.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guild || !req.userInfos.displayedGuilds || !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    }
    let guildData = await req.client.guildsData.findOne({ id: guild.id });
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
        const search: any = Object.values(data)[Object.keys(data).indexOf(`text_${edit}`)];
        let filtered = guildData.customCommands.filter((c) => c.name !== edit);
        let found = await guildData.customCommands.filter((c) => c.name === edit);
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
            if (isHex(data.colour[0]))
                guildData.colour = data.colour[0];
        }
        else {
            if (isHex(data.colour[1]))
                guildData.colour = data.colour[1];
        }
    }
    guildData.save();
    req.client.broadcastEval(`this.guilds.cache.get('${req.params.serverID}') ? this.databaseCache.guilds.set('${req.params.serverID}', { prefix : "${guildData.prefix}", colour: "${guildData.colour}" }) : ""`);
    res.redirect(303, "/manage/" + guild.id);
});

module.exports = router;