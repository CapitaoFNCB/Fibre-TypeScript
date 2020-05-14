import { Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class MessageListener extends Listener {
  public constructor() {
    super("message", {
      emitter: "client",
      event: "message"
    });
  }

  public async exec(message: Message) {

    if(!message.guild) return;
    let member;
    if(message.author.bot) return;
    const guild_member = await this.client.findOrCreateMember({id: message.author.id, guildId: message.guild!.id}, this.client)
    const user = await this.client.findOrCreateUser({id: message.author.id}, this.client)
    let guild = await this.client.creatOrFind({id: message.guild!.id})

    let useGuld = await this.client.guildsData.findOne({id: message.guild.id})

    if(message.content.startsWith(useGuld.prefix)) return;

      member = await this.client.membersData.findOne({id: message.author.id, guildId: message.guild.id})

      if(!member){
        member = this.client.createOrFind({id: message.author.id, guildId: message.guild.id})
      }

      if(!useGuld.level){
        member.characters += message.content.length
        member.save()
        return;
      };

      member.characters += message.content.length

      const amount = randomXP()
      const updatelevel = member.level * 650

      member.xp += amount

      if(member.xp + amount > updatelevel){
        member.xp = 0
        member.level += 1
        // message.channel.send(`${message.author.username} Has Leveled Up to level ${member.level}!`)
      }
      member.save()

      this.client.databaseCache.members.set(`${message.author.id}${message.guild.id}`,{
        xp: member.xp || 0,
        level: member.level || 0,
        messages: member.messages || 0,
        characters: member.characters || 0,
        cash: member.cash || 0,
        work_time: member.work_time || 0,
        rob_time: member.rob_time || 0,
        daily_time: member.daily_time || 0,
        _id: member._id || message.author.id,
        id: member.id,
        guildId: member.guildId,
        __v: member.__v || "__v"
    })
  }
}

function randomXP(){
  return Math.floor(Math.random() * ( Math.floor(12) - Math.ceil(7))) + Math.ceil(7);
}