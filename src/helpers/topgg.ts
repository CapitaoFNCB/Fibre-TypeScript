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

        let dbl = new DBL(dblapi.apiKey, { webhookPort: 5000, webhookAuth: dblapi.password })

        dbl.webhook!.on("vote", async (vote: any) => {
            let user = client.users.fetch(vote.user)
            // let logsChannel = client.channels.get(dblapi.channel);
            let logsChannel = client.broadcastEval(`this.channels.cache.get(${dblapi.channel})`, true);
            if(logsChannel){
                logsChannel.send(new client.Embed()
                    .setDescription(`${user} Just Voted!`)
                )
            }
        })

    }

}