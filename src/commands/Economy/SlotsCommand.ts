import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags"

export default class SlotsCommand extends Command {
  public constructor() {
    super("slots", {
      aliases: ["slots"],
      category: "Economy",
      channel: "guild",
      args: [
        {
            id: "target",
            type: "number",
            match: "rest",
            prompt:{
                start: "How Much do you want to gamble?",
                retry: "Try again, How much do you want to gamble?"
            }
          }
      ],
      description: {
        content: "Gamble with slots.",
        usage: "slots [ amount ]",
        examples: [
          "slots 100",
          "slots 1000"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { target }: { target: number }): Promise<Message> {

    if(target < 0) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("You Can't Use Negative Numbers")  
    )

    let emojis: any = ['🥭','🍓','🍋','🍑','🍈','🍊','🍐','🍇','🍒','🍅','🍎','🥕','🍌','🥝','🍆']

    let board: any = [];

    let targetuser = await this.client.membersData.findOne({ id: message.author.id, guildId: message.guild!.id})
    if(targetuser.cash < target) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("Unfortunately you don't have enough for this amount")
      )

    for(let i = 0; i < 9; i++){
        board.push(Math.floor(Math.random() * (Math.floor(10) - Math.ceil(1))) + Math.ceil(1))
    }

    let targetguild = await this.client.guildsData.findOne({id: message.guild!.id})

    if(emojis[board[3]] == emojis[board[4]] && emojis[board[4]] == emojis[board[5]]) {
        targetuser.cash += targetguild.jackpot
        targetuser.save()

        targetguild.jackpot = 0
        targetguild.save()
    }else if(emojis[board[3]] == emojis[board[4]] || emojis[board[4]] == emojis[board[5]]){
        targetuser.cash += (target * 2) - Number(target)
        targetuser.save()
    }else{
        targetuser.cash -= Number(target)
        targetuser.save()

        targetguild.jackpot += Number(Math.round(target/4))
        targetguild.save()
    }
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
    .setDescription(stripIndents`${emojis[board[0]]}${emojis[board[1]]}${emojis[board[2]]}
      ${emojis[board[3]]}${emojis[board[4]]}${emojis[board[5]]}
      ${emojis[board[6]]}${emojis[board[7]]}${emojis[board[8]]}
      ${(emojis[board[3]] == emojis[board[4]] && emojis[board[4]] == emojis[board[5]]) == true ? "You Won The Jackpot" : (emojis[board[3]] == emojis[board[4]] || emojis[board[4]] == emojis[board[5]]) == true ? "You Won": "You Lost"}`)
    )
  }
}