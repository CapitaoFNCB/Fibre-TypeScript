import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import { MessageAttachment } from "discord.js";

export default class TiasCommand extends Command {
  public constructor() {
    super("tias", {
      aliases: ["tias"],
      category: "Fun",
      description: {
        content: "Tias Command",
        usage: "tias",
        examples: ["tias"]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {

    return message.util!.send("", { files: [ `tias.mp4` ] })
  }
}