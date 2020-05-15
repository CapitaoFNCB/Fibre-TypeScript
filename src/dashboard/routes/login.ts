import express from "express";
import { dashboard } from "../../utils/Config";
const router = express.Router();
import passport from "passport";

router.get("/", passport.authenticate("discord", { failureRedirect: dashboard.failureURL }), async function(req, res) {
    if(!req.user.id || !req.user.guilds){
        res.redirect("/");
    }
    res.redirect("/");
    let user = await req.client.users.fetch(req.user.id);
    req.client.broadcastEval(`this.channels.cache.get("700277100996722738") ? this.channels.cache.get("700277100996722738").send(new this.Embed(null,"0491e2",this).setAuthor("Login Notification").setDescription("${req.user.username} has logged into dashboard").setThumbnail("${user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })}")) : ""`);

});

module.exports = router;