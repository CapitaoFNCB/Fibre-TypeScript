import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class PlayNowCommand extends Command {
  constructor() {
    super("playnow", {
      aliases: ["playnow"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Plays song straight away.", 
        usage: "playnow [ song url / name ]",
        examples: [
          "playnow ncs",
        ]
      },
    });
  }

  async exec (message: Message) {

    message.util!.send("Adding now :)")
 
  }
}