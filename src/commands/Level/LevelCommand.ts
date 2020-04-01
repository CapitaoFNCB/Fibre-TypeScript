import { Command } from "discord-akairo";
import { MessageEmbed, Message, MessageAttachment } from "discord.js";
import { Canvas } from "canvas-constructor"
import fetch from "node-fetch"
import membersData from "../../database/Member"

export default class Help extends Command {
  constructor() {
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
      }
    });
  }

  public async exec(message: Message, {target}: {target: any}) {
    
    if(!message.guild) return this.client.guildOnly(message.channel);

    const guild = await this.client.findOrCreateGuild({id: message.guild.id})

    if(!guild.level) return message.channel.send(new MessageEmbed()
    .setDescription("This Servers Level System is Disabled")
    .setColor("0491e2")
    )

    let member = await message.mentions.members!.first() || await this.client.resolve("member",target, message.guild,this.client) || message.member

    if(member.user.bot) return message.channel.send(new MessageEmbed()
        .setDescription("No Information is stored for bots")
        .setColor("0491e2")
    )

    
    const found = await this.client.findOrCreateMember({id: member.id, guildId: message.guild.id})

    const founduser = await this.client.findOrCreateUser({id: member.id})

    let rank: any = 1;
    let members = await membersData.find({ guildId: message.guild?.id }).lean(),
    membersLeaderboard = members.map((m) => {
      return {
          id: m.id,
          value: m.level
      };
    }).sort((a,b) => b.value - a.value);

    for (const search of membersLeaderboard) {
      const user = this.client.users.cache.get(search.id) || false;
      if(user){
              if(user.id === member.id){
                rank = "#"+ rank 
                 break
            }if(user.id !== member.id){
              rank++ 
            }
        }
    }

    if(!rank.toString().startsWith('#')) rank = '#' + rank

    const resultback = await fetch(founduser.backgound);
    if (!resultback.ok) return message.channel.send("Failed to get Backgound");
    const backgound = await resultback.buffer();

    const result = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 }));
    if (!result.ok) return message.channel.send("Failed to get Avatar");
    const avatar = await result.buffer();

    const buffer = await user();
    const filename = `profile.png`;
    const attachment = new MessageAttachment(buffer.toBuffer(), filename);
    await message.channel.send(attachment);

    async function user(){
        return new Canvas(934, 282)
        .addImage(backgound, 0, 0, 934, 282)
        .setColor("#2C2F33")
        .setShadowColor('rgba(22, 22, 22, 1)')
        .setShadowOffsetY(5)
        .setShadowBlur(10) 
        .addCircle(130, 130, 100)
        .addCircularImage(avatar,130,130,100)
        .addBeveledRect(260, 165, 650, 46)
        .setColor('#2C2F33')
        .fill()
        .restore()
        .addBeveledRect(260, 165, ((100 / (((found.level ** found.level) + 100) * 2) * found.xp) * 6.5) == 0 ? 1 : ((100 / (((found.level ** found.level) + 100) * 2) * found.xp) * 6.5), 46)
        .setColor(founduser.barcolour)
        .fill()
        .restore()
        .setTextAlign('left')
        .setTextFont('32px sans-serif')
        .setColor(founduser.text)
        .addText(member.user.tag, 275, 130)
        .setTextAlign('right')
        .addText(`LEVEL ${found.level}` , 880, 130)
        .addText(`RANK ${rank !== undefined ? rank : "N/A"}` , 880, 90)
        .addText(`${found.level + 1}` , 900, 250)
        .setTextAlign('center')
        .addText(`${found.xp}/${((found.level ** found.level) + 100) * 2}` , 575, 250)
        .setTextAlign('left')
        .addText(`${found.level}` , 275, 250)
    }
  }
}