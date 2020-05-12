import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Core",
      channel: "guild",
      description: {
        content: "Shows bot's latency", 
        usage: "ping",
        examples: [
          "ping"
        ]
      },
      typing: true
    });
  }

  exec(message: Message): Promise<Message> {
    return message.util!.send('Pinging...').then(async sent => {
        let timeDiff = Number(sent.editedTimestamp || sent.createdTimestamp) - Number(message.editedTimestamp || message.createdTimestamp)
        const hrStart: [number, number] = process.hrtime();
        await this.client.membersData.findOne({ id: message.author.id, guildId: message.guild!.id})
        const hrDiff: [number, number] = process.hrtime(hrStart);
        const execTime = hrDiff[0] > 0 ? `${hrDiff[0]}s` : `${Math.round(hrDiff[1] / 1000000)}ms`;
        let ping: number[] = await this.client.shard!.fetchClientValues('ws.ping')
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
          .setDescription(`Response: \`${timeDiff} ms\`\nLatency: \`${Math.round(this.client.ws.ping)} ms\`\nDataBase Ping: \`${execTime}\`\nAverage Shard Ping: \`${ping.reduce((a,b) => b + a) / ping.length}ms\``));
        });
    }
}