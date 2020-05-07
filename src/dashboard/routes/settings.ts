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
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

router.post("/", CheckAuth, async function(req, res){
    let user = await req.client.usersData.findOne({id:req.user.id});
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
    
                user.backgound = buffer
    
            }
        }  
    }

    if(data.colour){
        if(data.colour[0]){
            if (isHex(data.colour[0])){
                user.colour = data.colour[0]
            }
        }else{
            if (isHex(data.colour[1])){
                user.colour = data.colour[1]
            }
        }
    }

    user.save()
    
    res.redirect(303, "/settings");
});

module.exports = router;