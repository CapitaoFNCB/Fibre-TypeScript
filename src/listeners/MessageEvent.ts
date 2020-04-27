import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import safe from "safe-eval"

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
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})
    if(!message.author.bot){
      if(message.content.startsWith(guild.prefix)) return;
      
      member = await this.client.findOrCreateMember({id: message.author.id, guildId: message.guild?.id})

      if(!guild.level){
        member.characters += message.content.length
        member.save()
        return;
      };

      member.characters += message.content.length

      const amount = randomXP()
      const updatelevel = ((member.level ** member.level) + 100) * 2

      member.xp += amount

      if(member.xp + amount > updatelevel){
        member.xp = 0
        member.level += 1
        // message.channel.send(`${message.author.username} Has Leveled Up to level ${member.level}!`)
      }
      member.save()
    }
  }
}

function randomXP(){
  return Math.floor(Math.random() * ( Math.floor(12) - Math.ceil(7))) + Math.ceil(7);
}