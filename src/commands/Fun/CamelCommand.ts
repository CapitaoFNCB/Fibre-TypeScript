import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class CamelCommand extends Command {
  public constructor() {
    super("camel", {
      aliases: ["camel"],
      category: "Fun",
      description: {
        content: "Camel Command",
        usage: "camel",
        examples: ["camel"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.camel()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}