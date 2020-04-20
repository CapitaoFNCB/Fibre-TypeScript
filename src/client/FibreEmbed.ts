import { Message, MessageEmbed } from "discord.js";

export default class Embed extends MessageEmbed {
  public msg: Message;

  public constructor(msg: Message) {
    super();
    this.setColor("0491e2")
    this.msg = msg;
  }

  public errorEmbed(error?: string): this {
    return this.setAuthor(
      `Oops, ${this.msg.author.tag}`,
      this.msg.author.displayAvatarURL()
    )
      .setColor("0491e2")
      .setDescription(error || "Unknown Error")
      .setFooter(
        `${this.msg.client.user!.username} • ${new Date(
          Date.now()
        ).toLocaleTimeString()}`
      );
  }

  public promptEmbed(string?: string): this {
    return this
      .setColor("0491e2")
      .setDescription(string || "Unknown Prompt")
  }

  public addBlankField(inline: boolean): this {
    if(!inline) inline = true
    return this.addFields({
      name: "\u200B",
      value: "\u200B",
      inline: inline
    });
  }
}