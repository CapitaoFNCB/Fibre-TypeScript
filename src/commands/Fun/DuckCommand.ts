import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class DuckCommand extends Command {
  public constructor() {
    super("duck", {
      aliases: ["duck"],
      category: "Fun",
      description: {
        content: "Duck Command",
        usage: "duck",
        examples: ["duck"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.duck()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}