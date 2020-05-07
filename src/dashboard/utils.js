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
const discord_js_1 = __importDefault(require("discord.js"));
const Guild_1 = __importDefault(require("../database/Guild"));
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
function fetchGuild(guildID, client, guilds) {
    return __awaiter(this, void 0, void 0, function* () {
        let [guildData, rolesData, channelsData] = yield client.broadcastEval(`
        let guild = this.guilds.cache.get('${guildID}');
        if(guild) {
            [
                guild.toJSON(),
                guild.roles.cache.toJSON(),
                guild.channels.cache.toJSON()
            ]
        }
    `, true);
        if (!guildData)
            return;
        const guild = Object.assign(Object.assign(Object.assign({}, guildData), { roles: rolesData }), { channels: channelsData });
        let conf = yield Guild_1.default.findOne({ id: guild.id });
        return Object.assign(Object.assign(Object.assign({}, guild), conf ? conf.toJSON() : conf), guilds.find((g) => g.id === guild.id));
    });
}
function fetchUser(userData, client, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userData.guilds) {
            yield asyncForEach(userData.guilds, (guild) => __awaiter(this, void 0, void 0, function* () {
                let perms = new discord_js_1.default.Permissions(guild.permissions);
                if (perms.has("MANAGE_GUILD")) {
                    guild.admin = true;
                }
                const guildExists = yield client.broadcastEval(`
                let guild = this.guilds.cache.get('${guild.id}');
                if(guild) guild;
            `, true);
                guild.settingsUrl = (guildExists ? `/manage/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
                guild.statsUrl = (guildExists ? `/stats/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
                guild.levelsUrl = (guildExists ? `/levels/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
                guild.iconURL = (guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128` : "https://discordemoji.com/assets/emoji/discordcry.png");
                guild.displayed = (query ? guild.name.toLowerCase().includes(query.toLowerCase()) : true);
                guild.inGuild = (guildExists ? true : false);
            }));
            userData.displayedGuilds = userData.guilds.filter((g) => g.displayed && g.admin);
            if (userData.displayedGuilds.length < 1) {
                delete userData.displayedGuilds;
            }
        }
        let user = yield client.users.fetch(userData.id);
        let usersDb = yield client.getUsersData(client, [user]);
        let userDb = usersDb[0];
        let userInfos = Object.assign(Object.assign(Object.assign(Object.assign({}, user.toJSON()), userDb.toJSON()), userData), user.presence);
        return userInfos;
    });
}
function getLeaderboard(client, amount, leaderboard) {
    return __awaiter(this, void 0, void 0, function* () {
        let leaderboards = {
            money: sortArrayOfObjects("money", leaderboard),
            level: sortArrayOfObjects("level", leaderboard),
        };
        if (amount) {
            for (let cat in leaderboards) {
                let e = leaderboards[cat];
                if (e.length > amount) {
                    e.length = amount;
                }
            }
        }
        let stats = {
            money: yield fetchUsers(leaderboards.money, client),
            level: yield fetchUsers(leaderboards.level, client),
        };
        return stats;
    });
}
function fetchUsers(array, client) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let users = [];
            array.filter((e) => e.id).forEach((element) => {
                client.users.fetch(element.id).then((user) => {
                    user.username = user.username.replace(/[\W_]+/g, " ");
                    if (user.username.length > 13) {
                        user.username = user.username.substr(0, 10) + "...";
                    }
                    users.push(Object.assign({
                        money: element.money,
                        level: element.level,
                    }, user.toJSON()));
                });
            });
            resolve(users);
        });
    });
}
function sortArrayOfObjects(key, arr) {
    let array = arr.slice(0);
    return array.sort((a, b) => {
        return b[key] - a[key];
    });
}
exports.default = { fetchUser, fetchUsers, fetchGuild };
