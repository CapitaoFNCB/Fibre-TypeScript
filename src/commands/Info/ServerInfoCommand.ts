import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ServerInfoCommand extends Command {
  constructor() {
    super("serverinfo", {
      aliases: ["serverinfo", "si"],
      channel: "guild",
      category: "Info",
      description: {
        content: "Shows server information", 
        usage: "serverinfo",
        examples: [
          "serverinfo",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    message.util!.send("Adding now :)")
  }
}