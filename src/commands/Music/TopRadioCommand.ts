import { Command } from "discord-akairo";
import { Message } from "discord.js";
import radio from "radio-browser";
import { table } from "table";

export default class TopRadioCommand extends Command {
  constructor() {
    super("topradio", {
      aliases: ["topradio", "tr"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Searchs for the top radio stations right now.", 
        usage: "topradio",
        examples: [
          "topradio",
          "tr",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour);
    let filter = { by: 'topvote', limit: 10 };
    let data: any[] = await radio.getStations(filter);
    let mapped: any[] = data.map(radio => [ radio.name ])
    message.channel.send("test")
    return message.util!.send(new this.client.Embed(message, colour)
      .setAuthor("Top radio stations right now:")
      .setDescription(`\`\`\`${table(mapped)}\`\`\``)
    )
  }
}