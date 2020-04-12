import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class LlamaCommand extends Command {
  public constructor() {
    super("llama", {
      aliases: ["llama"],
      category: "Fun",
      description: {
        content: "Llama Command",
        usage: "llama",
        examples: ["llama"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.llama()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}