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

    reactions.on('collect', r => {
        if(r.emoji.name == "✂️"){
            console.log("1")
        }else if(r.emoji.name == "📰"){
            console.log("2")
        }else{
            console.log("3")
        }
    })
  }
}