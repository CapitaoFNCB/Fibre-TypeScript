import express from "express";
const router = express.Router();
import { dashboard } from "../../utils/Config";

router.get("/", async function(req, res) {
    await req.logout();
    res.redirect(dashboard.failureURL);
});

module.exports = router;