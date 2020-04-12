import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class SealCommand extends Command {
  public constructor() {
    super("seal", {
      aliases: ["seal"],
      category: "Fun",
      description: {
        content: "Seal Command",
        usage: "seal",
        examples: ["seal"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.seal()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}