import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ClapCommand extends Command {
  public constructor() {
    super("clap", {
      aliases: ["clap"],
      category: "Fun",
      args: [
        {
          id: "string",
          type: "string",
          match: "rest",
          prompt:{
            start: "What would you like me to clapify?"
          }
        }
      ],
      description: {
        content: "Clap Command",
        usage: "clap message",
        examples: ["clap hello"]
      },
    });
  }

  public async exec(message: Message, {string}: {string: String}) {
    return message.util!.send([...string].join("👏") + "👏")
  }
}