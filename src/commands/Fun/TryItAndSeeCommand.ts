import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TiasCommand extends Command {
  public constructor() {
    super("tias", {
      aliases: ["tias"],
      category: "Fun",
      description: {
        content: "Shows a MP4 file.",
        usage: "tias",
        examples: ["tias"]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {

    return message.util!.send("", { files: [ `tias.mp4` ] })
  }
}