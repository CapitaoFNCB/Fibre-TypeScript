import { Message } from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";
import os from "os";
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
        },
        typing: true
      });
    }
  
    public async exec(message: Message): Promise<Message> {

        const net = (await OSUtils.netstat.inOut()) as NetStatMetrics,
        cpu: number = await OSUtils.cpu.usage()
        
        let guilds: number[] = await this.client.shard!.fetchClientValues('guilds.cache.size')
        let users: number[] = await this.client.shard!.fetchClientValues('users.cache.size')
        let emojis: number[] = await this.client.shard!.fetchClientValues('emojis.cache.size')
        let music: number[] = await this.client.shard!.fetchClientValues('manager.players.size')
        let memory: number[] = await this.client.shard!.broadcastEval('process.memoryUsage().heapUsed / 1024 / 1024 / 1024')

        const embed = new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
        .addField("Bot Information:", `Guilds: \`${guilds.reduce((prev, guildCount) => prev + guildCount, 0).toLocaleString()}\`\nUsers: \`${users.reduce((prev, guildCount) => prev + guildCount, 0).toLocaleString()}\`\nEmojis: \`${emojis.reduce((prev, guildCount) => prev + guildCount, 0).toLocaleString()}\`\nMusic Performances: \`${music.reduce((prev, guildCount) => prev + guildCount, 0).toLocaleString()}\``, true)
        .addField("Process Information", `Node.js Version: \`${process.version}\`\nLangauge: [\`Typescript\`](${"https://www.typescriptlang.org"})\nDiscord.js: \`${require("discord.js").version}\`\nDiscord-akairo: \`${require("discord-akairo").version}\``,true)
        .addField("Process Usage", `CPU Usage: \`${cpu == 0 ? "0.1" : cpu}%\`\nMemory Usage: \`${memory.reduce((prev, guildCount) => prev + guildCount, 0).toFixed(2)} / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\`\nNetwork Usage: \`${net.total ? net.total.outputMb : "Hosted On Windows Cannot access"} ⬆️\` / \`${net.total ? net.total.inputMb : "Hosted On Windows Cannot access"} ⬇️\``)
        .addField("VPS Information", `CPU Cores: \`${os.cpus().length} ${os.cpus()[0].model}\`\nTotal Memory: \`${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB\`\nOS: \`${this.client.capitalize(os.platform())} (${os.release()})\`\nArch: \`${os.arch()}\``)
        const commits: string = await this.getCommits();
        if (commits) embed.addField(`Github Commits`, commits);

        return message.util!.send(embed)

    }
    private async getCommits() {
      const res = await fetch("https://api.github.com/repos/PizzaOnTop/Fibre-TypeScript/commits");
      let str: string = "";
      const json: any[] = await res.json();
  
      for (const { sha, html_url, commit, author } of json.slice(0, 5)) {
        str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.substr(0,80)} - **[${!author ? "Pizza" : author.login.toLowerCase()}](${!author ? "https://github.com/PizzaOnTop" :author.html_url})**\n`;
      }
  
      return str;
    }
}