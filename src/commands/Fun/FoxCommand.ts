import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class FoxCommand extends Command {
  public constructor() {
    super("fox", {
      aliases: ["fox"],
      category: "Fun",
      description: {
        content: "Fox Command",
        usage: "fox",
        examples: ["fox"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.fox()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}