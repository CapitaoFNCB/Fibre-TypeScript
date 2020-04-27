import { Command } from "discord-akairo";
import { Message } from "discord.js";

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
    });
  }

  public async exec(message: Message) {
  }
}