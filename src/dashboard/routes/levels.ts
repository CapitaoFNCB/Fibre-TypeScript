import express from "express";
import utils from "../utils";
import CheckAuth from "../auth/CheckAuth";
const router = express.Router();
import { dashboard } from "../../utils/Config"

router.get("/:serverID", CheckAuth, async(req, res) => {

    let guildInfos = await utils.fetchGuild(req.params.serverID, req.client, req.user.guilds).catch(null)
    
    if(!guildInfos){
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    }

   

    res.render("levels", {
        guild: guildInfos,
        levels: await req.client.membersData.find({ guildId: guildInfos.id }).lean(),
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

    if(Object.keys(data)[0]){ 
        let save_data = await req.client.findOrCreateMember({id: Object.keys(data)[0].split("_")[1], guildId: guild.id})
        save_data.level = 1
        save_data.xp = 0
        save_data.save()
    }

    res.redirect(303, "/levels/"+guild.id);
});

module.exports = router;