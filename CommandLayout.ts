import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class CommandLayout extends Command {
  public constructor() {
    super("", {
      aliases: [""],
      category: "Owner",
      description: {
        content: "",
        usage: "",
        examples: [""]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message) {
  }
}