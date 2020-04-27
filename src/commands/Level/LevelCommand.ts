import { Command } from "discord-akairo";
import { Message, MessageAttachment, GuildMember } from "discord.js";
import { Canvas } from "canvas-constructor"
import fetch from "node-fetch"
import membersData from "../../database/Member"

export default class Help extends Command {
  constructor() {
    super("level", {
      aliases: ["level"],
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
        content: "Level Command", 
        usage: "level",
        examples: ["level"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { member }: {member: GuildMember}): Promise<Message> {
    
    if(member.user.bot) return message.util!.send(new this.client.Embed()
        .setDescription("No Information is stored for bots")
    )

    const found = await this.client.findOrCreateMember({id: member.id, guildId: message.guild!.id})

    const founduser = await this.client.findOrCreateUser({id: member.id})

    let rank: any = 1;
    let members = await membersData.find({ guildId: message.guild!.id }).lean(),
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

    const result = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 }));
    if (!result.ok) return message.util!.send("Failed to get Avatar");
    const avatar = await result.buffer();

    const buffer = await user();
    const filename = `profile.png`;
    const attachment = new MessageAttachment(buffer.toBuffer(), filename);
    const embed = new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
      .attachFiles(attachment)
      .setImage(`attachment://profile.png`)
   return message.util!.send(embed)

    async function user(){
        return new Canvas(934, 282)
        .setColor("#2C2F33")
        .addBeveledRect(0, 0, 934, 282)
        .addBeveledImage(toBuffer(founduser.backgound.buffer), 0, 0, 934, 282)
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
        .setColor(founduser.colour)
        .fill()
        .restore()
        .setTextAlign('left')
        .setTextFont('32px sans-serif')
        .setColor(founduser.colour)
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

function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}