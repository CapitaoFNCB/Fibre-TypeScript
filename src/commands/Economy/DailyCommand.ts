import { Command } from "discord-akairo";
import { Message } from "discord.js";
import parse from "parse-ms"

export default class DailyCommand extends Command {
  public constructor() {
    super("daily", {
      aliases: ["daily"],
      channel: "guild",
      category: "Economy",
      description: {
        content: "Daily Command",
        usage: "daily",
        examples: ["daily"]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {
    let cooldown = 86400000
    const target = await this.client.membersData.findOne({ id: message.author.id, guildId: message.guild!.id})
    let amount
    if(target.daily_time == 0) {
        amount = Date.now() - 172800000  
    }else{
        amount = target.daily_time
    }

    if(cooldown - (Date.now() - amount) <= 0){
        target.daily_time = Date.now()
        let daily = (Math.floor(Math.random() * (Math.floor(50) - Math.ceil(25))) + Math.ceil(25))

        target.cash += daily;
        target.save()

        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
          .setDescription(`${message.author.username} Claimed $${daily}`)
        )

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
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription(`You cannot use daily for ${str}`)
      )
    }
  }
}