import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class VolumeCommand extends Command {
  constructor() {
    super("volume", {
      aliases: ["volume"],
      category: "Music",
      args: [
        {
            id: "amount",
            type: "number",
            match: "rest",
            prompt:{
              start: "What would you like to set the volume to?",
              retry: "Invalid amount, What would you like to set the volume to?"
            }
          }
      ],
      description: {
        content: "Volume Command", 
        usage: "volume [amount]",
        examples: ["volume 150"]
      }
    });
  }

  async exec (message: Message, { amount }: { amount: number }) {

    if(!message.guild) return this.client.guildOnly(message.channel);

    const player = this.client.manager.players.get(message.guild?.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed().setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed().setDescription("You need to be in the same voice channel as me to use Leave Command"));
    
    message.util!.send(new this.client.Embed()
        .setDescription(`Player volume set from ${player.volume} to ${amount}`)
    )

    player.setVolume(amount)
  }
}