import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class JokeCommand extends Command {
  public constructor() {
    super("joke", {
      aliases: ["joke"],
      category: "Fun",
      channel: "guild",
      description: {
        content: "Tells a joke from an API.",
        usage: "joke",
        examples: [
          "joke"
        ]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {
    const data = await api.joke()
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    return message.util!.send(new this.client.Embed(message, colour)
        .setTitle(data.data.title)
        .setDescription(data.data.body)
        .setURL(data.data.url)
    )
  }
}