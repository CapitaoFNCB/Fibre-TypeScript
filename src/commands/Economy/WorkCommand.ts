import { Command } from "discord-akairo";
import { Message } from "discord.js";
import parse from "parse-ms"

export default class WorkCommand extends Command {
  public constructor() {
    super("work", {
      aliases: ["work"],
      category: "Economy",
      channel: "guild",
      description: {
        content: "Collects your 6 hour bonus.",
        usage: "work",
        examples: ["work"]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let cooldown = 21600000
    const target = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})
    let amount

    if(target.work_time == 0) {
        amount = Date.now() - 172800000
    }else{
        amount = target.work_time
    }
    if(cooldown - (Date.now() - amount) <= 0){
        target.work_time = Date.now()
        let hours = (Math.floor(Math.random() * (Math.floor(8) - Math.ceil(2))) + Math.ceil(2))
        let amount = (Math.floor(Math.random() * (Math.floor(14) - Math.ceil(7))) + Math.ceil(7))

        target.cash += amount * hours;
        target.save()

        return message.util!.send(new this.client.Embed(message, colour)
          .setDescription(`${message.author.username} worked for ${hours} hours at a rate of $${amount} an hour`)
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
        return message.util!.send(new this.client.Embed(message, colour)
          .setDescription(`You cannot work for ${str}`)
        )
    }
  }
}