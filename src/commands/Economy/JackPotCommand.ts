import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class JackpotCommand extends Command {
  public constructor() {
    super("jackpot", {
      aliases: ["jackpot"],
      category: "Economy",
      args: [
        {
            id: "amount",
            type: "string",
            prompt:{
              start: "What radio station would you like to listen too?"
            }
          }
      ],
      description: {
        content: "Jackpot Command",
        usage: "jackpot [amount]",
        examples: ["jackpot 100"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { amount }: { amount: Number }) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    if(isNaN(Number(amount))) return message.channel.send(new MessageEmbed()
    .setDescription("Invalid Amount")
    .setColor("0491e2"))


    if(!message.guild) return this.client.guildOnly(message.channel);
    const message2 = await message.channel.send(new MessageEmbed()
      .setTitle("JACKPOT!!")
      .setDescription("React with 💰 to enter the jackpot. You have 30 seconds")
      .setColor("0491e2")
      .setFooter("If you don't have enough your reaction will be removed"))
    await message2.react("💰")
    const filter = (reaction) => reaction.emoji.name === '💰';
    const collector = message2.createReactionCollector(filter, { time: 30000 });

    collector.on('collect', async (r,user) => {
      if(user.bot) return;
      
      let target = await this.client.findOrCreateMember({id: user.id, guildId: message.guild?.id})
      

      if(target.cash < amount) r.users.remove(user.id)

    });
    collector.on('end', async (r, time) => {
      let users = r.first()?.users.cache.filter(u => !u.bot)

      if(!users?.size) return message.channel.send(new MessageEmbed()
      .setDescription("No one Entered the jackpot")
      .setColor("0491e2")
      )

      await users?.forEach(async user => {
        let all_users = await this.client.findOrCreateMember({id: user.id, guildId: message.guild?.id})
        all_users.cash -= Number(amount)
        all_users.save()
      })

      let winner = users?.random()

      message.channel.send(new MessageEmbed()
        .setDescription(`${winner.username} Won!!`)
        .setColor("0491e2"))


      setTimeout(async () =>{
        let target = await this.client.findOrCreateMember({id: winner.id, guildId: message.guild?.id})
        target.cash += Number(users?.size) * Number(amount)

        target.save()
      },100)
    })
  }
}