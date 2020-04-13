import { Message } from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";
import OSUtils, { NetStatMetrics } from "node-os-utils";

export default class BotstatsCommand extends Command {
    public constructor() {
      super("botstats", {
        aliases: ["botstats"],
        category: "Core",
        description: {
          content: "Displays the bots statistics",
          usage: "botstats",
          examples: ["botstats"]
        }
      });
    }
  
    public async exec(message: Message) {

        const promises = [
            this.client.shard?.fetchClientValues('guilds.cache.size'),
            this.client.shard?.fetchClientValues('users.cache.size'),
            this.client.shard?.fetchClientValues('emojis.cache.size'),
            this.client.shard?.broadcastEval('process.memoryUsage().heapUsed / 1024 / 1024 / 1024'),
            this.client.shard?.fetchClientValues('manager.players.size')
        ];
        let totalGuilds
        let totalUsers
        let totalEmojis
        let totalUsage
        let totalMusic

        const net = (await OSUtils.netstat.inOut()) as NetStatMetrics,
        cpu = await OSUtils.cpu.usage()

        console.log(net)

        // \nUsage: \`${totalUsage.toFixed(2)}\`

        Promise.all(promises).then(async results => {
            totalGuilds = results[0]?.reduce((prev, guildCount) => prev + guildCount, 0);
            totalUsers = results[1]?.reduce((prev, usercount) => prev + usercount, 0);
            totalEmojis = results[2]?.reduce((prev, emojicount) => prev + emojicount, 0);
            totalUsage = results[3]?.reduce((prev, usagecount) => prev + usagecount, 0);
            totalMusic = results[4]?.reduce((prev, musiccount) => prev + musiccount, 0);
            const embed = new this.client.Embed()
            // .addField(`Process Information`,`Node.js Version: \`${process.version}\`\nLangauge: [\`Typescript\`](${"https://www.typescriptlang.org"})\nDiscord.js: \`${require("discord.js").version}\`\nDiscord-akairo: \`${require("discord-akairo").version}\``,true)
            .setAuthor(`${this.client.user!.username}`, this.client.user!.displayAvatarURL())
            .addField(`Bot Stats`, `Guilds: \`${totalGuilds}\`\nUsers: \`${totalUsers}\`\nEmojis: \`${totalEmojis}\`\nPlayers: \`${totalMusic}\`\nOwner: \`Pizza#2020\``, true)
            .addField("Process Information", `Network: \`${net.total.outputMb} ⬆️\` / \`${net.total.inputMb} ⬇️\``)
    
            message.util!.send(embed)
        })



    }
}