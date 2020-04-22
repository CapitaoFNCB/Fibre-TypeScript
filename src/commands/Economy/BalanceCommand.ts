import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class BalanceCommand extends Command {
  public constructor() {
    super("balance", {
      aliases: ["balance", "bal"],
      category: "Economy",
      channel: "guild",
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
      typing: true
    });
  }

  public async exec(message: Message, {target}: {target: any}): Promise<Message> {

    let member = await message.mentions.members!.first() || await this.client.resolve("member",target, message.guild,this.client) || message.member

    if(member.user.bot) return message.util!.send(new this.client.Embed()
      .setDescription("No Information is stored for bots")
    )

    const user = await this.client.findOrCreateMember({id: member.id, guildId: message.guild?.id})
    return message.util!.send(new this.client.Embed()
        .setDescription(`Cash: ${user.cash}`)
    )
  }
}