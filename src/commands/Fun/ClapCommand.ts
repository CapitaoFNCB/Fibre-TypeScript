import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ClapCommand extends Command {
  public constructor() {
    super("clap", {
      aliases: ["clap"],
      category: "Fun",
      channel: "guild",
      args: [
        {
          id: "string",
          type: "string",
          match: "rest",
          prompt:{
            start: "What would you like me to clapify?"
          }
        }
      ],
      description: {
        content: "Clap Command",
        usage: "clap message",
        examples: ["clap hello"]
      },
      typing: true
    });
  }

  public async exec(message: Message, {string}: {string: String}): Promise<Message> {
    if(string.length > 500) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("Cannot clapify this due to its length")
    )
    return message.util!.send([...string].join("👏") + "👏")
  }
}