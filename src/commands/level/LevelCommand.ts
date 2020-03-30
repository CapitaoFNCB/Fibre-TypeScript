import { Command } from "discord-akairo";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { createCanvas, loadImage } from "canvas"
import { join } from "path"
import membersData from "../../database/Member"

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

    let rank: any = 1;
    let members = await membersData.find({ guildId: message.guild?.id }).lean(),
    membersLeaderboard = members.map((m) => {
      return {
          id: m.id,
          value: m.level
      };
    }).sort((a,b) => b.value - a.value);

    for (const member of membersLeaderboard) {
      const user = this.client.users.cache.get(member.id) || false;
      if(user){
              if(user.id === member.id){
                rank = "#"+ rank 
                break
            }if(user.id !== member.id){
            }
        }
    }
    
    const found = await this.client.findOrCreateMember({id: member.id})
  
    const canvas = createCanvas(1000,333);
    const ctx = canvas.getContext('2d');
    const background = await loadImage(join(__dirname, "..", "..","..","RankCard.png"));

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 4;
    
    ctx.fillStyle = "#e67e22"
    ctx.globalAlpha = 0.6;
    ctx.fillRect(180, 190, (100 / (((found.level ** found.level) + 100) * 2) * found.xp) * 7.7, 65)
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#ffffff'
    ctx.globalAlpha = 0.2;
    ctx.fillRect(180,190, 770, 65);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeRect(180,190, 770, 65);
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff"
    ctx.fillText(`${found.xp} / ${((found.level ** found.level) + 100) * 2}`, 600, 285)
    
    ctx.textAlign = "left";
    ctx.fillText(member.user.tag, 300, 180)
    ctx.fillText(found.level, 260, 285)
    ctx.textAlign = "right";
    ctx.fillText(`Messages: ${found.messages > 1000 ? found.messages > 1000000 ? found.messages > 1000000000 ? found.messages > 1000000000000 ? `${(found.messages/1000000000000).toFixed(2)}t` : `${(found.messages/1000000000).toFixed(2)}b` : `${(found.messages/1000000).toFixed(2)}m` : `${(found.messages/1000).toFixed(2)}k` : found.messages}`, 940, 120)
    ctx.fillText(`Characters: ${found.characters > 1000 ? found.characters > 1000000 ? found.characters > 1000000000 ? found.characters > 1000000000000 ? `${(found.characters/1000000000000).toFixed(2)}t` : `${(found.characters/1000000000).toFixed(2)}b` : `${(found.characters/1000000).toFixed(2)}m` : `${(found.characters/1000).toFixed(2)}k` : found.characters}`, 940, 150)
    ctx.fillText(`Rank: ${rank}`, 940, 180)
    ctx.fillText(found.level + 1, 940, 285)
    
    ctx.textAlign = "left";
    ctx.arc(170, 160, 120, 0, Math.PI * 2, true)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke()
    ctx.closePath()
    ctx.clip()
    const avatar = await loadImage(member.user.displayAvatarURL({format: "png", size: 2048}))
    ctx.drawImage(avatar, 40, 40, 250, 250)
    const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png")
    message.channel.send("",attachment)
  }
}