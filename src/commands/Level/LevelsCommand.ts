import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class LevelsCommand extends Command {
  public constructor() {
    super("levels", {
      aliases: ["levels"],
      category: "Level",
      channel: "guild",
      description: {
        content: "Levels Command",
        usage: "levels",
        examples: ["levels"]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setAuthor(`${message.guild!.name}'s Levels`)
        .setDescription(`\`https://fibrebot.xyz/levels/${message.guild!.id}\``)
    )
  }
}