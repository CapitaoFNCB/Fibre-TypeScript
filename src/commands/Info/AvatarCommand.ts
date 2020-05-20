import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";

export default class AvatarCommand extends Command {
  constructor() {
    super("avatar", {
      aliases: ["avatar", "av", "pfp"],
      category: "Info",
      channel: "guild",
      args: [
        {
          id: "member",
          type: "member",
          default: (_) => _.member
        }
      ],
      description: {
        content: "Display's avatar of a user.", 
        usage: "avatar < user >",
        examples: [
          "avatar pizza#2020",
          "avatar 665237546183294999",
          "avatar pizza",
          "av 665237546183294999",
          "pfp pizza",
        ]
      },
    });
  }

  async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    return message.util!.send(new this.client.Embed(message, colour)
      .setAuthor(`${member === message.member ? "Your" : `${member.user.username}'s`} Avatar`)
      .setImage(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
    )
  }
}