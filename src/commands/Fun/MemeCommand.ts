import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class MemeCommand extends Command {
  public constructor() {
    super("meme", {
      aliases: ["meme"],
      category: "Fun",
      channel: "guild",
      description: {
        content: "Shows a meme image from an API.",
        usage: "meme",
        examples: ["meme"]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const data = await api.meme()

    return message.util!.send(new this.client.Embed(message, colour)
      .setTitle(data.data.title)
      .setDescription(data.data.body)
      .setURL(data.data.url)
      .setImage(data.data.image)
    )
  }
}