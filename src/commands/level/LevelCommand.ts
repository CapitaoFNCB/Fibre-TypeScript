import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class LevelCommand extends Command {
  public constructor() {
    super("level", {
      aliases: ["level"],
      category: "Level",
      args: [
        {
            id: "target",
            type: "string",
            match: "rest",
            default: null
          }
      ],
      description: {
        content: "Level Command",
        usage: "level",
        examples: ["level"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, {target}: {target: any}) {
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
    
    const found = await this.client.findOrCreateMember({id: member.id})
    
    return message.channel.send(new MessageEmbed()
        .setDescription(`${member.user.username}'s Current Level\nLevel: ${found.level} XP: ${found.xp}`)
        .setColor("0491e2")
    )
  }
}