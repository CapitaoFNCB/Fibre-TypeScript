import { Message, MessageEmbed } from "discord.js";

export default class Embed extends MessageEmbed {
  public msg: Message;

  public constructor(msg: any, colour? : string) {
    super();
    this.setColor(colour ? colour : "0491e2")
    this.msg = msg;
  }

  public errorEmbed(error?: string, colour?: string): this {
    return this.setAuthor(
      `Oops, ${this.msg.author.tag}`,
      this.msg.author.displayAvatarURL()
    )
      .setDescription(error || "Unknown Error")
      .setFooter(
        `${this.msg.client.user!.username} • ${new Date(
          Date.now()
        ).toLocaleTimeString()}`
      );
  }

  public promptEmbed(string: string, colour: string, cancel: boolean): this {
    if(cancel) this.setFooter("Type 'cancel' to cancel request")
    return this
      .setDescription(string || "Unknown Prompt")
      .setColor(colour ? colour : "0491e2")
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