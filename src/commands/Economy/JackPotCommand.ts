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
        examples: ["radio Kiss Uk"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { amount }: { amount: Number }) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    const message2 = await message.channel.send("TEST")
    await message2.react("💰")
    const filter = (reaction) => reaction.emoji.name === '💰';
    const collector = message2.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', (r,user) => console.log(`${user.id}`));
  }
}