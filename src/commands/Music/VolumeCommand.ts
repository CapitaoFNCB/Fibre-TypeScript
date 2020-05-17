import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";

export default class VolumeCommand extends Command {
  constructor() {
    super("volume", {
      aliases: ["volume"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "amount",
            type: async (message: Message, amount: String) => {
              if(!message.member?.voice.channelID) return "This user is not in a voice channel, ask to join"
              let player = await this.client.manager.players.get(message.guild!.id)
              if(!player) return "there is no player for this guild"
              if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct"
              if(Number(amount) && (Number(amount) > 0 && Number(amount) <= 1000)) return amount
              if(!Number(amount)) return Flag.fail(amount)
            },
            match: "rest",
            prompt:{
              start: "What would you like to set the volume to?",
              retry: "Invalid amount, Volume range is 1-1000."
            }
          }
      ],
      description: {
        content: "Sets the current volume of a player.", 
        usage: "volume [ amount ]",
        examples: ["volume 150"]
      },
    });
  }

  async exec (message: Message, { amount }: { amount: number }) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const player = this.client.manager.players.get(message.guild!.id)

    message.util!.send(new this.client.Embed(message, colour)
        .setDescription(`Player volume set from ${player.volume}% to ${amount}%`)
    )

    player.setVolume(amount)
  }
}