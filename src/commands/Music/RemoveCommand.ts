import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class RemoveCommand extends Command {
  constructor() {
    super("remove", {
      aliases: ["remove"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Removes song from queue.", 
        usage: "remove [ position ]",
        examples: [
          "remove 1",
          "remove 2",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    message.util!.send("Adding now :)")
 
  }
}