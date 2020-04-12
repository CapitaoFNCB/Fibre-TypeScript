import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class MemeCommand extends Command {
  public constructor() {
    super("meme", {
      aliases: ["meme"],
      category: "Fun",
      description: {
        content: "Meme Command",
        usage: "meme",
        examples: ["meme"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.meme()

    message.util!.send(new this.client.Embed()
      .setTitle(data.data.title)
      .setDescription(data.data.body)
      .setURL(data.data.url)
      .setImage(data.data.image)
    )
  }
}