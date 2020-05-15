import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";

export default class BalanceCommand extends Command {
  public constructor() {
    super("balance", {
      aliases: ["balance", "bal"],
      category: "Economy",
      channel: "guild",
      args: [
        {
          id: "member",
          type: "member",
          default: (_) => _.member
        }
      ],
      description: {
        content: "Shows user's balance.",
        usage: "balance < user >",
        examples: [
          "balance",
          "balance pizza",
          "balance 424566306042544128"
        ]
      },
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {

    if(member.user.bot) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setDescription("No Information is stored for bots")
    )

    const user = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription(`Cash: ${user.cash}`)
    )
  }
}