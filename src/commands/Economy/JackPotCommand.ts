import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class JackpotCommand extends Command {
  public constructor() {
    super("jackpot", {
      channel: "guild",
      aliases: ["jackpot"],
      category: "Economy",
      args: [
        {
            id: "amount",
            type: "number",
            prompt:{
              start: "How much will the jackpot be for?",
              retry: "Invalid Amount, How much will the jackpot be for?"
            }
          }
      ],
      description: {
        content: "Gamble for jackpot.",
        usage: "jackpot [ amount ]",
        examples: [
          "jackpot 100",
          "jackpot 1000"
        ]
      },
    });
  }

  public async exec(message: Message, { amount }: { amount: Number }) {

    if(isNaN(Number(amount))) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setDescription("Invalid Amount")
    )


    const message2 = await message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setTitle("JACKPOT!!")
      .setDescription("React with 💰 to enter the jackpot. You have 30 seconds")
      .setFooter("If you don't have enough your reaction will be removed"))
    await message2.react("💰")
    const filter = (reaction) => reaction.emoji.name === '💰';
    const collector = message2.createReactionCollector(filter, { time: 30000 });

    collector.on('collect', async (r,user) => {
      if(user.bot) return;
      
      let target = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})

      if(target.cash < amount) r.users.remove(user.id)

    });
    collector.on('end', async (r, time) => {
      let users = r.first()?.users.cache.filter(u => !u.bot)

      if(!users?.size) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("No one Entered the jackpot")
      )

      await users?.forEach(async user => {
        let all_users = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})
        all_users.cash -= Number(amount)
        all_users.save()
      })

      let winner = users?.random()

      message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription(`${winner.username} Won!!`)
      )

      message2.reactions.removeAll().catch(err => null)

      setTimeout(async () =>{
        let target = await this.client.findOrCreateMember({ id: message.author.id, guildId: message.guild!.id})
        target.cash += Number(users?.size) * Number(amount)

        target.save()
      },100)
    })
  }
}