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
        content: "Command that allows you to clapify text.",
        usage: "clap this is a message",
        examples: [
          "clap hello there",
          "clap left right up down"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { string }: { string: String }): Promise<Message> {

    if(string.length > 1000) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("Cannot clapify this due to its length")
    )
    return message.util!.send(string.split(" ").join(" 👏 "))
  }
}