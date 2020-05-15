import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player, IEqualizerBand } from "erela.js";
import { Flag } from "discord-akairo";

export default class BassBoostCommand extends Command {
  constructor() {
    super("bassboost", {
      aliases: ["bassboost", "bb"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "query",
            type: async (message: Message, amount: String) => {
                if(!message.member?.voice.channelID) return "This user is not in a voice channel, ask to join"
                let player = await this.client.manager.players.get(message.guild!.id)
                if(!player) return "there is no player for this guild"
                if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct"
                if(Number(amount) && (Number(amount) <= 200)) return amount
                if(!Number(amount)) return Flag.fail(amount)
            },
            match: "rest",
            prompt:{
              start: "How much would you like to bass boost by?",
              retry: "Invalid amount, try again, the scale is 0-200"
            }
          }
      ],
      description: {
        content: "Increases bass of song.", 
        usage: "bassboost",
        examples: [
          "bassboost"
        ]
      },
    });
  }

  async exec (message: Message, { query }: { query: any }): Promise<Message | any> {
    if(query == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("You need to be in a voice channel."));
    if(query == "there is no player for this guild") return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("There is currently no player for this guild."));
    if(query == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`You need to be in the same voice channel as me to use Bassboost Command.`));
    query = Number(query)
    let player: Player = await this.client.manager.players.get(message.guild!.id)
    let bands: IEqualizerBand[] = [ { band:3, gain: query / 200 }, { band: 4, gain: query / 200 } ]
    player.setEQ(bands)
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`${this.client.emojiList.message.accept} Setting bass boost to ${query}%`));
  }
}