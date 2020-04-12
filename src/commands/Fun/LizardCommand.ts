import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class LizardCommand extends Command {
  public constructor() {
    super("lizard", {
      aliases: ["lizard"],
      category: "Fun",
      description: {
        content: "Lizard Command",
        usage: "lizard",
        examples: ["lizard"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.lizard()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}