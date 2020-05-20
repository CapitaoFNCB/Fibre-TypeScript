import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";
import ms from "ms";

export default class SeekCommand extends Command {
  constructor() {
    super("seek", {
      aliases: ["seek"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "query",
            type: async (message: Message, amount: String) => {
                if(!message.member!.voice.channelID) return "This user is not in a voice channel, ask to join";
                let player: Player = await this.client.manager.players.get(message.guild!.id)
                if(!player) return "There is no player for this guild";
                if(!player.queue[0]) return "There is nothing left in the queue to seek";
                if(player.queue[0].isStream) return "Cannot seek a live audio stream";
                if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct";
                if(amount && Number(amount)) return Number(amount) * 1000;
                if(amount && ms(amount)) return ms(amount);
            },
            match: "rest",
            prompt:{
              start: "Where would you like to seek to in this current song?",
              retry: "Invalid amount, please try again."
            }
          }
      ],
      description: {
        content: "Seeks to a position in a song.", 
        usage: "seek [ amount ]",
        examples: [
          "seek 100",
          "seek 10s",
          "seek 1m"
        ]
      },
    });
  }

  async exec (message: Message, { query }: { query: any }) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(query == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel."));
    if(query == "There is no player for this guild") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(query == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use Seek Command.`));
    if(query == "Cannot seek a live audio stream") return message.util!.send(new this.client.Embed(message, colour).setDescription("You cannot seek through live audio streams."));
    if(query == "There is nothing left in the queue to seek") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no songs in the queue."));
    let player: Player = await this.client.manager.players.get(message.guild!.id);
    if(Number(query) >= player.queue[0].duration || Number(query) <= 0) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Cannot seek ${ms(query)} due to song duration.`));
    player.seek(Number(query));
    return message.util!.send(new this.client.Embed(message, colour).setDescription(`Seeked to ${ms(player.position)}`));
  }
}