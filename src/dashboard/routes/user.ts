import express from "express"
import utils from "../utils"
import CheckAuth from "../auth/CheckAuth"
const router = express.Router();
import { dashboard } from "../../utils/Config";

router.get("/:userID", CheckAuth, async function(req, res) {
    let userInfos = await utils.fetchUser({
        id: req.params.userID,
    }, req.client).catch((err) => {
        res.render("404", {
            user: req.userInfos,
            currentURL: `${dashboard.baseURL}/${req.originalUrl}`
        });
    });
    res.render("user", {
        user: req.userInfos,
        userInfos: {
            ...userInfos,
        },
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

module.exports = router;