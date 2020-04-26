import { Command } from "discord-akairo";
import { Message } from "discord.js";
import moment from "moment";

export default class PingCOmmand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Core",
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
        let timeDiff = Number(moment(sent.editedAt || sent.createdAt).format("x")) - Number(moment(message.editedAt || message.createdAt).format("x"))

        return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
          .setDescription(`Response: \`${timeDiff} ms\`\nLatency: \`${Math.round(this.client.ws.ping)} ms\``));
        });
    }
}