import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class RewindCommand extends Command {
  constructor() {
    super("rewind", {
      aliases: ["rewind"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Rewinds through a song.", 
        usage: "rewind [ amount ]",
        examples: [
          "rewind 100",
          "rewind 10s",
          "rewind 1m"
        ]
      },
    });
  }

  async exec (message: Message) {

    message.util!.send("Adding now :)")
 
  }
}