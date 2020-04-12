import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class DogCommand extends Command {
  public constructor() {
    super("dog", {
      aliases: ["dog"],
      category: "Fun",
      description: {
        content: "Dog Command",
        usage: "dog",
        examples: ["dog"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await api.dog()

    message.util!.send(new this.client.Embed()
        .setImage(data.data.file)
    )
  }
}