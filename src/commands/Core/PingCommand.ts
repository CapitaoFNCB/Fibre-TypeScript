import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCOmmand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Core",
      channel: "guild",
      description: {
        content: "Ping Command", 
        usage: "ping",
        examples: ["ping"]
      },
      typing: true
    });
  }

  exec(message: Message): Promise<Message> {
    return message.util!.send('Pinging...').then(async sent => {
        let timeDiff = Number(sent.editedTimestamp || sent.createdTimestamp) - Number(message.editedTimestamp || message.createdTimestamp)

        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
          .setDescription(`Response: \`${timeDiff} ms\`\nLatency: \`${Math.round(this.client.ws.ping)} ms\``));
        });
    }
}