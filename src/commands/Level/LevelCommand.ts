import { Command } from "discord-akairo";
import { Message, MessageAttachment, GuildMember } from "discord.js";
import { Canvas } from "canvas-constructor";
import fetch from "node-fetch";
const { createCanvas, loadImage } = require("canvas")

export default class Help extends Command {
  constructor() {
    super("level", {
      aliases: ["level", "rank"],
      category: "Level",
      channel: "guild",
      args: [
        {
          id: "member",
          type: "member",
          default: (_) => _.member
        }
      ],
      description: {
        content: "Shows user's level.", 
        usage: "level < user >",
        examples: [
          "level",
          "level 665237546183294999",
          "level pizza",
          "level pizza#2020"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(member.user.bot) return message.util!.send(new this.client.Embed(message, colour)
        .setDescription("No Information is stored for bots.")
    )

    const found = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})

    if(!found) return message.util!.send(new this.client.Embed(message, colour)
      .setDescription("Couldn't find data in database.")
    )
    
    function test(level, xp){
      let count = 0
      for (var i = 1; i < level + 1; i ++) {
          count = count + ((i ** i) + 100) * 2
      }
      return count + xp
  }
    let levels = await this.client.membersData.find({ guildId: message.guild!.id }).lean()
    let membersLeaderboard = await levels.map((m) => { return { id: m.id, level: m.level, xp: m.xp, totalxp: test(m.level, m.xp) };}).sort((a,b) => b.totalxp - a.totalxp);
    let leader_rank: number | string = membersLeaderboard.map(user => user.id).indexOf(member.id) + 1 == 0 ? "Unknown" : membersLeaderboard.map(user => user.id).indexOf(member.id) + 1
    let image = await loadImage(`images/${member.user.presence.status}.png`)
    const user_data = await this.client.findOrCreateUser({ id: member.id })
    const result = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 }));
    if (!result.ok) return message.util!.send("Failed to get Avatar");
    const avatar = await result.buffer();
    const buffer = await user();
    const attachment = new MessageAttachment(buffer.toBuffer(), `profile.png`);
   return message.util!.send(attachment)

    async function user(){
        let canvas = new Canvas(934, 282)
        .setColor("#2C2F33")
        .addRect(0, 0, 934, 282)
        if(user_data.premium) canvas.addImage(toBuffer(user_data.backgound.buffer), 0, 0, 934, 282)
        canvas.setColor("#2C2F33")
        .setShadowColor('rgba(22, 22, 22, 1)')
        .setShadowOffsetY(5)
        .setShadowBlur(10)
        .setColor(user_data.colour)
        .addCircle(90, 130, 175)
        .setColor("#000000")
        .addCircle(110, 130, 80)
        .addCircularImage(avatar,110,130,70)
        .setColor(user_data.colour)
        .addRect(380, 150,(100 / ((found.level * 650)) * 4.5) * found.xp == 0 ? 1 : (100 / ((found.level * 650)) * 4.5) * found.xp, 46)
        .setColor("#ffffff")
        .setTextAlign('left')
        .setTextFont('45px arvo')
        .addText(member.user.tag.length > 15 ? member.user.tag.slice(0,12) + "..." : member.user.tag, 370, 130)
        .setTextAlign('right')
        .setTextFont('25px arvo')
        .setTextAlign('left')
        .addText(`Level: ${found.level}`, 380, 230)
        .setTextAlign('right')
        .addText(`XP: ${size(found.xp)} / ${size(found.level * 650)}`, 835, 230)
        .addText(`${found.xp == 0 && found.level == 1 ? "" : `Rank ${leader_rank == 0 ? "Unranked" : "#" + leader_rank}`}`, 835, 260)
        .addImage(image, 0, 0, 934, 282)
        return canvas
    }
  }
}

// ( ((100 / ((found.level * 650) * found.xp) * 4.5) == 0 ? 1 : (100 / ((found.level * 650) * found.xp) * 4.5)

function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

function size(amount: number){
  if(amount > 1000000) {
    return (amount / 1000000).toFixed(2) + "M"
  } else if(amount > 1000) {
    return (amount / 1000).toFixed(2) + "K"
  } else {
    return amount
  }
}
