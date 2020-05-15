import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class SeekCommand extends Command {
  constructor() {
    super("seek", {
      aliases: ["seek"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Seeks to a position in a song.", 
        usage: "seek [ amount ]",
        examples: [
          "seek 100",
          "seek 10s",
          "seek 1m"
        ]
      },
    });
  }

  async exec (message: Message) {

    message.util!.send("Adding now :)")
 
  }
}