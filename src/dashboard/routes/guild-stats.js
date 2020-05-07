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
const colors_generator_1 = __importDefault(require("colors-generator"));
const Config_1 = require("../../utils/Config");
router.get("/:serverID", CheckAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let guildInfos = yield utils_1.default.fetchGuild(req.params.serverID, req.client, req.user.guilds);
    if (!guildInfos || !req.userInfos.displayedGuilds || !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)) {
        return res.render("404", {
            user: req.userInfos,
            currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
        });
    }
    const membersData = yield req.client.membersData.find({ guildID: guildInfos.id }).lean();
    let leaderboards = {
        money: sortArrayOfObjects("money", membersData),
        level: sortArrayOfObjects("level", membersData)
    };
    for (let cat in leaderboards) {
        let e = leaderboards[cat];
        if (e.length > 10)
            e.length = 10;
    }
    let stats = { money: yield utils_1.default.fetchUsers(leaderboards.money, req.client), level: yield utils_1.default.fetchUsers(leaderboards.level, req.client) };
    res.render("stats/guild", {
        stats,
        user: req.userInfos,
        currentURL: `${Config_1.dashboard.baseURL}/${req.originalUrl}`
    });
}));
module.exports = router;
function getCommands(commands) {
    let aDateCommand = {};
    commands.forEach((cmd) => {
        let tDate = formatDate(new Date(cmd.date));
        if (aDateCommand[tDate]) {
            aDateCommand[tDate]++;
        }
        else {
            aDateCommand[tDate] = 1;
        }
    });
    return aDateCommand;
}
function getCommandsUsage(commands) {
    let objectCount = commands.reduce((acc, curr) => {
        if (typeof acc[curr.command] == "undefined") {
            acc[curr.command] = 1;
        }
        else {
            acc[curr.command] += 1;
        }
        return acc;
    }, {});
    let percentages = getPercentagePerKey(objectCount);
    let colors = colors_generator_1.default.generate("#86bff2", percentages.length).get();
    let i = 0;
    percentages.forEach((p) => {
        p.color = colors[i];
        i++;
    });
    return percentages;
}
function getPercentagePerKey(myArray) {
    let sum = getSum(myArray);
    let arrayWithPercentages = [];
    let val;
    let percentage;
    for (const key in myArray) {
        val = myArray[key];
        let percentage = Math.round((val / sum) * 100);
        arrayWithPercentages.push({ key, percentage });
    }
    return arrayWithPercentages;
}
function getSum(myArray) {
    let sum = 0;
    for (const key in myArray) {
        sum += myArray[key];
    }
    return sum;
}
function sortArrayOfObjects(key, arr) {
    let array = arr.slice(0);
    return array.sort((a, b) => {
        return b[key] - a[key];
    });
}
function formatDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    date = mm + "/" + dd;
    return date;
}
