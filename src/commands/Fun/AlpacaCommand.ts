import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class AlpacaCommand extends Command {
  public constructor() {
    super("alpaca", {
      aliases: ["alpaca"],
      category: "Fun",
      description: {
        content: "Alpaca Command",
        usage: "alpaca",
        examples: ["alpaca"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.alpaca()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}