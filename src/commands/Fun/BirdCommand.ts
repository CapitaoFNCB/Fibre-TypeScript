import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class BirdCommand extends Command {
  public constructor() {
    super("bird", {
      aliases: ["bird"],
      category: "Fun",
      description: {
        content: "Bird Command",
        usage: "bird",
        examples: ["bird"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.bird()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}