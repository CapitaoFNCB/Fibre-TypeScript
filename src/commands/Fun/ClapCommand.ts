import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ClapCommand extends Command {
  public constructor() {
    super("clap", {
      aliases: ["clap"],
      category: "Fun",
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
    if(string.length > 500) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
      .setDescription("Cannot clapify this due to its length")
    )
    return message.util!.send([...string].join("👏") + "👏")
  }
}