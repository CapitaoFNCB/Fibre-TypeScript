import express from "express";
import { dashboard } from "../../utils/Config";
const router = express.Router();
import passport from "passport";

router.get("/", passport.authenticate("discord", { failureRedirect: dashboard.failureURL }), async function(req, res) {
    if(!req.user.id || !req.user.guilds){
        res.redirect("/");
    }
    res.redirect("/");
});

module.exports = router;