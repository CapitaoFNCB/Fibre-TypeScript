import { Message, MessageEmbed } from "discord.js";
import { findOrCreateGuild } from "../utils/Functions"
import { AkairoClient } from "discord-akairo";

export default class Embed extends MessageEmbed {
  public msg: Message;

  public constructor(msg: Message, colour: string) {
    super();
    this.setColor(colour)
    this.msg = msg;
  }

  public errorEmbed(error?: string): this {
    return this.setAuthor(`Oops, ${this.msg.author.tag}`, this.msg.author.displayAvatarURL())
               .setDescription(error || "Unknown Error")
               .setFooter(`${this.msg.client.user!.username} • ${new Date(Date.now()).toLocaleTimeString()}`
      );
  }

  public promptEmbed(string: string, cancel: boolean): this {
    if(cancel) this.setFooter("Type 'cancel' to cancel request")
    return this.setDescription(string || "Unknown Prompt")
  }

  public addBlankField(inline: boolean): this {
    if(!inline) inline = true
    return this.addFields({ name: "\u200B", value: "\u200B", inline: inline });
  }
}