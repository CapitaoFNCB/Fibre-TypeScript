import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class SkiptoCommand extends Command {
  constructor() {
    super("skipto", {
      aliases: ["skipto", "goto"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Goes to specific song in queue.", 
        usage: "skipto [ position ]",
        examples: [
          "skipto 1",
          "goto 2",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    message.util!.send("Adding now :)")
 
  }
}