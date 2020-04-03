import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import parse from "parse-ms"

export default class DailyCommand extends Command {
  public constructor() {
    super("daily", {
      aliases: ["daily"],
      category: "Economy",
      description: {
        content: "Daily Command",
        usage: "daily",
        examples: ["daily"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    let cooldown = 86400000
    const target = await this.client.findOrCreateMember({id: message.author.id, guildId: message.guild?.id})
    let amount
    if(target.daily_time == 0) {
        amount = Date.now() + cooldown
    }else{
        amount = target.daily_time
    }
    if((Date.now() + cooldown) - amount <= 0){
        target.daily_time = Date.now()
        let daily = (Math.floor(Math.random() * (Math.floor(50) - Math.ceil(25))) + Math.ceil(25))

        message.util!.send(new MessageEmbed()
        .setDescription(`${message.author.username} Claimed $${daily}`)
        .setColor("0491e2")
        )

        target.cash += daily;
        target.save()
    }else{
        let str = ""
        if(parse(cooldown - (Date.now() - amount)).hours > 1){
            str += `${parse(cooldown - (Date.now() - amount)).hours}h `
        }
        if(parse(cooldown - (Date.now() - amount)).minutes > 1){
            str += `${parse(cooldown - (Date.now() - amount)).minutes}m `
        }
        if(parse(cooldown - (Date.now() - amount)).seconds > 1){
            str += `${parse(cooldown - (Date.now() - amount)).seconds}s`
        }
        return message.util!.send(new MessageEmbed()
        .setDescription(`You cannot use daily for ${str}`)
        .setColor("0491e2"))
    }
  }
}