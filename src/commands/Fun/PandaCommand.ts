import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class PandaCommand extends Command {
  public constructor() {
    super("panda", {
      aliases: ["panda"],
      category: "Fun",
      description: {
        content: "Panda Command",
        usage: "panda",
        examples: ["panda"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.panda()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}