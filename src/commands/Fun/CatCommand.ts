import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class CatCommand extends Command {
  public constructor() {
    super("cat", {
      aliases: ["cat"],
      category: "Fun",
      description: {
        content: "Cat Command",
        usage: "cat",
        examples: ["cat"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.cat()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}