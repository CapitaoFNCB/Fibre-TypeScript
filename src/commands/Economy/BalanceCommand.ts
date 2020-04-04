import { Command } from "discord-akairo";
import { Message } from "discord.js";

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
    });
  }

  public async exec(message: Message, {target}: {target: any}) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    
    let member = await message.mentions.members!.first() || await this.client.resolve("member",target, message.guild,this.client) || message.member

    if(member.user.bot) return message.util!.send(new this.client.Embed()
      .setDescription("No Information is stored for bots")
    )

    const user = await this.client.findOrCreateMember({id: member.id, guildId: message.guild?.id})
    message.util!.send(new this.client.Embed()
        .setDescription(`Cash: ${user.cash}`)
    )
  }
}