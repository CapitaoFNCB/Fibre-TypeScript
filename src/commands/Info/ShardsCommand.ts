import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { table } from "table";

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
    const shardInfo = await this.client.shard!.broadcastEval(`[[this.shard.ids[0]],[this.shard.mode == "process" ? "Online" : "Offline"],[this.guilds.cache.size],[this.channels.cache.size],[this.users.cache.size],[(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2) + " GB"],[this.manager.players.size],[this.ws.ping]]`);
    shardInfo.splice(0, 0, ["Shard ID", "Shard Mode", "Guilds", "Channels", "Users", "Memory Usage", "Players", "Ping"] );
    return message.util!.send(`\`\`\`prolog\n${table(shardInfo)}\`\`\``)
  }
}