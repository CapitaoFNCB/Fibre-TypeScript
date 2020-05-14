import Discord from "discord.js";

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

/**
 * Fetch guild informations
 * @param {string} guildID The ID of the guild to fetch
 * @param {object} client The discord client instance
 * @param {array} guilds The user guilds
 */
async function fetchGuild(guildID, client, guilds){
    let [guildData, rolesData, channelsData] = await client.broadcastEval(`
        let guild = this.guilds.cache.get('${guildID}');
        if(guild) {
            [
                guild.toJSON(),
                guild.roles.cache.toJSON(),
                guild.channels.cache.toJSON()
            ]
        }
    `, true);
    if(!guildData) return;
    const guild = {...guildData,...{ roles: rolesData },... { channels: channelsData }};
    let any: any = await client.findOrCreateGuild({id:guild.id}, client);
    let conf: any = await client.guildsData.findOne({ id: guild.id })
    let data = conf ? conf.toJSON() : conf
    return { ...guild, ...conf.toJSON(), ...guilds.find((g) => g.id === guild.id) };
}

/**
 * Fetch user informations (stats, guilds, etc...)
 * @param {object} userData The oauth2 user informations
 * @param {object} client The discord client instance
 * @param {string} query The optional query for guilds
 * @returns {object} The user informations
 */
async function fetchUser(userData, client, query?){
    if(userData.guilds){
        await asyncForEach(userData.guilds, async (guild) => {
            let perms = new Discord.Permissions(guild.permissions);
            if(perms.has("MANAGE_GUILD")){
                guild.admin = true;
            }
            const guildExists = await client.broadcastEval(`
                let guild = this.guilds.cache.get('${guild.id}');
                if(guild) guild;
            `, true);
            guild.settingsUrl = (guildExists ? `/manage/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
            guild.statsUrl = (guildExists ? `/stats/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
            guild.levelsUrl = (guildExists ? `/levels/${guild.id}/` : `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`);
            guild.iconURL = (guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128` : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgeeknewscentral.com%2Fwp-content%2Fuploads%2F2017%2F08%2FDiscord-logo-300x300.jpg&f=1&nofb=1");
            guild.displayed = (query ? guild.name.toLowerCase().includes(query.toLowerCase()) : true);
            guild.inGuild = (guildExists ? true : false);
        });
        userData.displayedGuilds = userData.guilds.filter((g) => g.displayed && g.admin);
        if(userData.displayedGuilds.length < 1){
            delete userData.displayedGuilds;
        }
    }
    let user = await client.users.fetch(userData.id);
    let usersDb = await client.getUsersData(client, [ user ]);
    let userDb = usersDb[0];
    let userInfos = { ...user.toJSON(), ...userDb.toJSON(), ...userData, ...user.presence };
    return userInfos;
}

/**
 * Get the leaderboard for money, level and reputation
 * @param {object} client The Discord client instance
 * @param {number} amount The amount of members to displays in each category (optional)
 * @param {array} leaderboard An array of user data
 * @returns {object}
 */
async function getLeaderboard(client, amount, leaderboard){
    let leaderboards = {
        money: sortArrayOfObjects("money", leaderboard),
        level: sortArrayOfObjects("level", leaderboard),
    };
    if(amount){
        for(let cat in leaderboards){
            let e = leaderboards[cat];
            if(e.length > amount){
                e.length = amount;
            }
        }
    }
    let stats = {
        money: await fetchUsers(leaderboards.money, client),
        level: await fetchUsers(leaderboards.level, client),
    };
    return stats;
}

async function fetchUsers(array, client) {
    return new Promise((resolve, reject) => {
        let users: any[] = [];
        array.filter((e) => e.id).forEach((element) => {
            client.users.fetch(element.id).then((user) => {
                user.username = user.username.replace(/[\W_]+/g," ");
                if(user.username.length > 13){
                    user.username = user.username.substr(0, 10)+"...";
                }
                users.push({ ...{
                    money: element.money,
                    level: element.level,
                }, ...user.toJSON() });
            });
        });
        resolve(users);
    });
}

function sortArrayOfObjects(key, arr){
    let array = arr.slice(0);
    return array.sort((a, b) => {
        return b[key] - a[key];
    });
}

export default { fetchUser, fetchUsers, fetchGuild };