import DBL from "dblapi.js";
import { DBL as dblapi } from "../utils/Config";

module.exports = {

    init(client){
        let stats = new DBL(dblapi.apiKey, client)
        client.logger.info("Started Top.GG Webhook")
        setInterval(async function(){
            let guilds: number[] = await client.shard!.fetchClientValues('guilds.cache.size')
            let bot_guilds: number = guilds.reduce((prev, guildCount) => prev + guildCount, 0)
            stats.postStats(bot_guilds);
        }, 60000*10);
    }

}