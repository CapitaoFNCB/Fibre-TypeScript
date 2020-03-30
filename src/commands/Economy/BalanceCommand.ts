import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class BalanceCommand extends Command {
  public constructor() {
    super("balance", {
      aliases: ["balance", "bal"],
      category: "Economy",
      args: [
        {
            id: "target",
            type: "string",
            match: "rest",
            default: null
          }
      ],
      description: {
        content: "Balance Command",
        usage: "balance",
        examples: ["balance"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, {target}: {target: any}) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    let member;
    if(message.mentions.members?.size && message.content.length > 0){
      member = await message.mentions.members.first()
    }else{
        member = await this.client.resolve("member",target, message.guild,this.client) || message.member
    }

    if(member.user.bot) return message.channel.send(new MessageEmbed()
      .setDescription("No Information is stored for bots")
      .setColor("0491e2")
    )

    const user = await this.client.findOrCreateMember({id: member.id, guildId: message.guild?.id})
    message.channel.send(new MessageEmbed()
        .setDescription(`Cash: ${user.cash}`)
        .setColor("0491e2")
    )
  }
}