import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class NotificationsCommand extends Command {
  constructor() {
    super("notifications", {
      aliases: ["notifications", "alerts"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Enabled or Disabled music notifications.", 
        usage: "notifications",
        examples: [
          "notifications",
          "alerts"
        ]
      },
    });
  }

  async exec (message: Message) {

    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})
    guild.notifications = !guild.notifications
    guild.save()
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription(`${guild.notifications ? "Enabled" : "Disabled"} Notifications`)
    )
  }
}