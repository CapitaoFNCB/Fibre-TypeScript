import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("reload", {
      aliases: ["reload"],
      category: "Owner",
      description: {
        content: "Reload Command",
        usage: "reload",
        examples: ["reload"]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message) {
    this.client.commandHandler.reloadAll()
    return message.channel.send(new MessageEmbed()
      .setDescription("Reloaded All Commands!")
      .setColor("0491e2")
    )
  }
}