import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class RockPaperScissorsCommand extends Command {
  public constructor() {
    super("rps", {
      aliases: ["rps"],
      category: "Fun",
      description: {
        content: "Rock Paper Scissors Command",
        usage: "rps",
        examples: ["rps"]
      },
    });
  }

  public async exec(message: Message) {
      let channel_message = await message.util!.send(new this.client.Embed()
        .setDescription("React to play!")
    )
    channel_message.react("✂️");
    channel_message.react("📰");
    channel_message.react("🧱");

    const filter = (reaction, user) => (reaction.emoji.name === '✂️' || '📰' || '🧱') && user.id === message.author.id;

    const reactions = channel_message.createReactionCollector(filter, { time: 15000 });

    const choices = ["✂️","📰","🧱"]

    let bot_choice = choices[(Math.floor(Math.random() * (Math.floor(choices.length) - Math.ceil(0))) + Math.ceil(0))]

    reactions.on('collect', r => {

      channel_message.edit(new this.client.Embed().setDescription(result(r.emoji.name, bot_choice)))

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
      channel_message.reactions.removeAll().catch(err => {
        message.channel.send(new this.client.Embed()
            .setDescription("I Don't have permissions to delete my emojis"))
      })
    })
  }
}