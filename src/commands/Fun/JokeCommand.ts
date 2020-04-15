import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class JokeCommand extends Command {
  public constructor() {
    super("joke", {
      aliases: ["joke"],
      category: "Fun",
      description: {
        content: "Joke Command",
        usage: "joke",
        examples: ["joke"]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {
    const data = await api.joke()

    return message.util!.send(new this.client.Embed()
        .setTitle(data.data.title)
        .setDescription(data.data.body)
        .setURL(data.data.url)
    )
  }
}