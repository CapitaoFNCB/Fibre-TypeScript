import express from "express";
import utils from "../utils";
import fetch from "node-fetch";
import CheckAuth from "../auth/CheckAuth";
const router = express.Router();
import { dashboard } from "../../utils/Config";
import isHex from "is-hexcolor";

router.get("/", CheckAuth, async function(req, res) {
    res.render("settings", {
        user: req.userInfos,
        database_user: await req.client.findOrCreateUser({ id: req.user.id }),
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

router.post("/", CheckAuth, async function(req, res){
    const founduser = await req.client.findOrCreateUser({ id: req.user.id })
    let data = req.body;

    if(data.image) {
        let collected;

        try{
            collected = await fetch(data.image)
        }catch (e) {
            collected = null;
        }

        if(collected){
            let buffer = await collected.buffer()

            if(buffer){
    
                founduser.backgound = buffer
    
            }
        }  
    }

    if(data.colour){
        if(data.colour[0]){
            if (isHex(data.colour[0])){
                founduser.colour = data.colour[0]
            }
        }else{
            if (isHex(data.colour[1])){
                founduser.colour = data.colour[1]
            }
        }
    }

    founduser.save()
    res.redirect(303, "/settings");
});

module.exports = router;