import { Message, MessageEmbed } from "discord.js";

export default class Embed extends MessageEmbed {
  public msg: Message;

  public constructor(msg: Message) {
    super();
    this.setColor("0491e2")
    this.msg = msg;
  }


  public addBlankField(): this {
    return this.addFields({
      name: "\u200B",
      value: "\u200B"
    });
  }
}