import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { stripIndents } from "common-tags";

export default class ShardsCommand extends Command {
  constructor() {
    super("shards", {
      aliases: ["shards"],
      channel: "guild",
      category: "Info",
      description: {
        content: "Shows all shard information.", 
        usage: "shards",
        examples: [
          "shards"
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour);
    let embed = new this.client.Embed(message, colour)
    await (await this.client.shard!.broadcastEval(`[this.shard.ids[0],this.shard.mode == "process" ? "Online" : "Offline",this.guilds.cache.size,this.channels.cache.size,this.users.cache.size,(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2) + " GB",this.manager.players.size,this.ws.ping]`)).map(data => embed.addField(`Shard ${data[0]}`,stripIndents`\`\`\`js\nGuilds: ${data[2].toLocaleString()}\nChannels: ${data[3].toLocaleString()}\nUsers: ${data[4].toLocaleString()}\nMemory Usage: ${data[5]}\nMusic Streams: ${data[6].toLocaleString()}\nAPI Latency: ${data[7].toLocaleString()} ms\`\`\``, true));
    embed.addField("Total Stats:", stripIndents`\`\`\`js\nGuilds: ${await (await this.client.shard!.broadcastEval(`this.guilds.cache.size`)).reduce((a, b) => b + a).toLocaleString()}\nChannels: ${await (await this.client.shard!.broadcastEval(`this.channels.cache.size`)).reduce((a, b) => b + a).toLocaleString()}\nUsers: ${await (await this.client.shard!.broadcastEval(`this.users.cache.size`)).reduce((a, b) => b + a).toLocaleString()}\nMemory Usage: ${await (await this.client.shard!.broadcastEval(`(process.memoryUsage().heapUsed / 1024 / 1024 / 1024)`)).reduce((a, b) => b + a).toLocaleString()} GB\nMusic Streams: ${await (await this.client.shard!.broadcastEval(`this.manager.players.size`)).reduce((a, b) => b + a).toLocaleString()}\nAverage API Latency: ${await ((await this.client.shard!.broadcastEval(`this.ws.ping`)).reduce((a, b) => b + a) / this.client.shard!.count).toLocaleString()} ms\`\`\``, false)
    message.util!.send(embed)
  }
}