"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Config_1 = require("../../utils/Config");
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
router.get("/", passport_1.default.authenticate("discord", { failureRedirect: Config_1.dashboard.failureURL }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user.id || !req.user.guilds) {
            res.redirect("/");
        }
        res.redirect("/");
        let user = yield req.client.users.fetch(req.user.id);
        req.client.broadcastEval(`this.channels.cache.get("700277100996722738") ? this.channels.cache.get("700277100996722738").send(new this.Embed(null,"0491e2",this).setAuthor("Login Notification").setDescription("${req.user.username} has logged into dashboard").setThumbnail("${user.displayAvatarURL({ format: "pmg", dynamic: true, size: 2048 })}")) : ""`);
    });
});
module.exports = router;
