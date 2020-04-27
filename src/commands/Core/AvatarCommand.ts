import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";

export default class AvatarCommand extends Command {
  constructor() {
    super("avatar", {
      aliases: ["avatar", "av", "pfp"],
      category: "Core",
      channel: "guild",
      args: [
        {
          id: "member",
          type: "member",
          default: (_) => _.member
        }
      ],
      description: {
        content: "Avatar Command", 
        usage: "avatar",
        examples: ["avatar pizza#2020"]
      },
      typing: true
    });
  }

  async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {

    return message.channel.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
      .setAuthor(`${member === message.member ? "Your" : `${member.user.username}'s`} Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    )
  }
}