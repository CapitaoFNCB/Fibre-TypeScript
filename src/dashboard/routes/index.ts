import express from "express";
import CheckAuth from "../auth/CheckAuth";
const router = express.Router();
import { dashboard } from "../../utils/Config"

router.get("/", CheckAuth, async (req, res) => {
    res.redirect("/selector");
});

router.get("/selector", CheckAuth, async(req, res) => {
    res.render("selector", {
        user: req.userInfos,
        currentURL: `${dashboard.baseURL}/${req.originalUrl}`
    });
});

module.exports = router;