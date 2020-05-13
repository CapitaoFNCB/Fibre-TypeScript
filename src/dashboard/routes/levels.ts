import express from "express";
import utils from "../utils";
import CheckAuth from "../auth/CheckAuth";
const router = express.Router();
import { dashboard } from "../../utils/Config";
import { asyncForEach } from "../utils";
import Discord from "discord.js";

router.get("/:serverID", CheckAuth, async(req, res) => {

    let guildInfos = await utils.fetchGuild(req.params.serverID, req.client, req.user.guilds).catch(null)
    
    if(!guildInfos){
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    }

    function test(level, xp){
        let count = 0
        for (var i = 1; i < level + 1; i ++) {
            count = count + ((i ** i) + 100) * 2
        }
        return count + xp
    }

    let levels = await req.client.membersData.find({ guildId: guildInfos.id }).lean()

    let membersLeaderboard = await levels.map((m) => { return { id: m.id, level: m.level, xp: m.xp, totalxp: test(m.level, m.xp) };}).sort((a,b) => b.totalxp - a.totalxp);

    res.render("levels", {
        guild: guildInfos,
        membersLeaderboard: membersLeaderboard,
        levels: levels,
        user: req.userInfos,
        bot: req.client,
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });

});

router.post("/:serverID", CheckAuth, async(req, res) => {

    let guild = await utils.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if(!guild){
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    }
    
    let data = req.body;

    await asyncForEach(req.user.guilds, async (guild) => {

        if(guild.id === req.params.serverID){
            let perms = new Discord.Permissions(guild.permissions);
            if(perms.has("MANAGE_GUILD")){
                if(Object.keys(data)[0]){ 
                    let save_data = await req.client.membersData.findOne({id: Object.keys(data)[0].split("_")[1], guildId: guild.id})
                    save_data.level = 1
                    save_data.xp = 0
                    save_data.save()
                }
            }
        }
    })

    // let guild_info = await req.client.broadcastEval(`this.guilds.cache.get("${guild.id}") ? this.guilds.cache.get("${guild.id}") : null`, true)

    // let perms = guild_info.members.get(`${req.user.id}`)

    // console.log(perms)


    res.redirect(303, "/levels/"+guild.id);
});

module.exports = router;