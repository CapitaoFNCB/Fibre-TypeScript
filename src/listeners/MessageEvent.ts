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
    let user;
    let member;
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})
    let args = message.content.slice(guild.prefix.length).trim().split(/ +/g);
    if(message.content.startsWith(guild.prefix)) {
      return this.client.logger.info(`${message.author.username} ran ${this.client.capitalize(args[0])} Command`)
    };
    if(!message.author.bot){
      user = await this.client.findOrCreateUser({id: message.author.id})
      member = await this.client.findOrCreateMember({id: message.author.id, guildId: message.guild?.id})

      member.characters += message.content.length
  
      if(!guild.level) return;
      const amount = randomXP()
      const updatelevel = ((member.level ** member.level) + 100) * 2

      member.xp += amount

      if(member.xp + amount > updatelevel){
        member.xp = 0
        member.level += 1
        message.channel.send(`${message.author.username} Has Leveled Up to level ${member.level}!`)
      }
      member.save()
    }
  }
}

function randomXP(){
  return Math.floor(Math.random() * ( Math.floor(12) - Math.ceil(7))) + Math.ceil(7);
}