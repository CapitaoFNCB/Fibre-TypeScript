import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class RockPaperScissorsCommand extends Command {
  public constructor() {
    super("rps", {
      aliases: ["rps"],
      category: "Fun",
      channel: "guild",
      description: {
        content: "Play's a game of Rock, Paper and Scissors game",
        usage: "rps",
        examples: ["rps"]
      },
    });
  }

  public async exec(message: Message) {
      let channel_message = await message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("React to this message to play!")
    )
    channel_message.react("✂️");
    channel_message.react("📰");
    channel_message.react("🧱");

    const filter = (reaction, user) => (reaction.emoji.name === '✂️' || '📰' || '🧱') && user.id === message.author.id;

    const reactions = channel_message.createReactionCollector(filter, { time: 15000 });

    const choices = ["✂️","📰","🧱"]

    let bot_choice = choices[(Math.floor(Math.random() * (Math.floor(choices.length) - Math.ceil(0))) + Math.ceil(0))]

    reactions.on('collect', async r => {

      channel_message.edit(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`${result(r.emoji.name, bot_choice)}\n ${r.emoji.name} vs ${bot_choice}`))

      reactions.stop()

      function result(user, bot) {
        if ((user === "🧱" && bot === "✂️") || (user === "📰" && bot === "🧱") || (user === "✂️" && bot === "📰")) {
          return "You Win!"
        }else if(user === bot){
          return "We Tied"
        }else{
          return "You Lost!"
        }
      }
      channel_message.reactions.removeAll().catch(err => null)
    })
  }
}