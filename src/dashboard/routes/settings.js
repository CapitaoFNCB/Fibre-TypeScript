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
const node_fetch_1 = __importDefault(require("node-fetch"));
const CheckAuth_1 = __importDefault(require("../auth/CheckAuth"));
const router = express_1.default.Router();
const Config_1 = require("../../utils/Config");
const is_hexcolor_1 = __importDefault(require("is-hexcolor"));
router.get("/", CheckAuth_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render("settings", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    });
});
router.post("/", CheckAuth_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield req.client.usersData.findOne({ id: req.user.id });
        let data = req.body;
        if (data.image) {
            let collected;
            try {
                collected = yield node_fetch_1.default(data.image);
            }
            catch (e) {
                collected = null;
            }
            if (collected) {
                let buffer = yield collected.buffer();
                if (buffer) {
                    user.backgound = buffer;
                }
            }
        }
        if (data.colour) {
            if (data.colour[0]) {
                if (is_hexcolor_1.default(data.colour[0]))
                    user.colour = data.colour[0];
            }
            else {
                if (is_hexcolor_1.default(data.colour[1]))
                    user.colour = data.colour[1];
            }
        }
        user.save();
        res.redirect(303, "/settings");
    });
});
module.exports = router;
