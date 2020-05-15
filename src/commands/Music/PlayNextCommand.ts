import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class PlayNextCommand extends Command {
  constructor() {
    super("playnext", {
      aliases: ["playnext"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Plays song next after current song ends.", 
        usage: "playnext [ song url / name ]",
        examples: [
          "playnext ncs",
        ]
      },
    });
  }

  async exec (message: Message) {

    message.util!.send("Adding now :)")
 
  }
}