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
const utils_1 = __importDefault(require("../utils"));
const CheckAuth_1 = __importDefault(require("../auth/CheckAuth"));
const router = express_1.default.Router();
const Config_1 = require("../../utils/Config");
router.get("/:userID", CheckAuth_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userInfos = yield utils_1.default.fetchUser({
            id: req.params.userID,
        }, req.client).catch((err) => {
            res.render("404", {
                user: req.userInfos,
                currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
            });
        });
        res.render("user", {
            user: req.userInfos,
            userInfos: Object.assign({}, userInfos),
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    });
});
module.exports = router;
