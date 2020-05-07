import express from "express";
import CheckAuth from "../auth/CheckAuth"
const router = express.Router();
import { dashboard } from "../../utils/Config"

router.get("/", CheckAuth, async(req, res) => {
    res.render("commands", {
        user: req.userInfos,
        bot: req.client,
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

module.exports = router;