import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";

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
            this.client.shard?.fetchClientValues('music.players.size')
        ];
        let totalGuilds
        let totalUsers
        let totalEmojis
        let totalUsage
        let totalMusic

        Promise.all(promises).then(async results => {
            totalGuilds = results[0]?.reduce((prev, guildCount) => prev + guildCount, 0);
            totalUsers = results[1]?.reduce((prev, usercount) => prev + usercount, 0);
            totalEmojis = results[2]?.reduce((prev, emojicount) => prev + emojicount, 0);
            totalUsage = results[3]?.reduce((prev, usagecount) => prev + usagecount, 0);
            totalMusic = results[4]?.reduce((prev, musiccount) => prev + musiccount, 0);
            const embed = new MessageEmbed()
            .setColor("0491e2")
            // .addField(`Process Information`,`Node.js Version: \`${process.version}\`\nLangauge: [\`Typescript\`](${"https://www.typescriptlang.org"})\nDiscord.js: \`${require("discord.js").version}\`\nDiscord-akairo: \`${require("discord-akairo").version}\``,true)
            .setAuthor(
                `Bot Information | ${this.client.user?.username}`,
                this.client.user?.displayAvatarURL()
              )
              .setColor("#0491e2")
              .addField(
                `Regular Information`,
                `Guilds: \`${totalGuilds}\`\nUsers: \`${totalUsers}\`\nEmojis: \`${totalEmojis}\`\nUsage: \`${totalUsage.toFixed(2)}\`\nMusic Performances: \`${totalMusic}\`\nOwner: \`Pizza#2020\``,
                true
              )
            const commits = await this.getCommits();
            if (commits) embed.addField(`Github Commits`, commits);
    
            message.util!.send(embed)
        })



    }
    private async getCommits() {
        const res = await fetch(
        "https://api.github.com/repos/PizzaOnTop/Fibre-TypeScript/commits"
        );
        let str = "";
        const json = await res.json();

        for (const { sha, html_url, commit, author } of json.slice(0, 5)) {
        str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.substr(
            0,
            80
        )} - **[@${author.login.toLowerCase()}](${author.html_url})**\n`;
        }

        return str;
    }
}