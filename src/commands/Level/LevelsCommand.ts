import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class LevelsCommand extends Command {
  public constructor() {
    super("levels", {
      aliases: ["levels"],
      category: "Level",
      channel: "guild",
      description: {
        content: "Show's url to guild's level.",
        usage: "levels",
        examples: ["levels"]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    return message.util!.send(new this.client.Embed(message, colour)
        .setAuthor(`${message.guild!.name}'s Levels`)
        .setDescription(`[\`https://fibrebot.xyz/levels/${message.guild!.id}\`](https://fibrebot.xyz/levels/${message.guild!.id})`)
    )
  }
}