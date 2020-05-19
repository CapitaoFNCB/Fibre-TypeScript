import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";
import ms from "ms";
import { Flag } from "discord-akairo";

export default class RewindCommand extends Command {
  constructor() {
    super("rewind", {
      aliases: ["rewind"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "query",
            type: async (message: Message, amount: String) => {
                if(!message.member!.voice.channelID) return "This user is not in a voice channel, ask to join";
                let player: Player = await this.client.manager.players.get(message.guild!.id)
                if(!player) return "There is no player for this guild";
                if(!player.queue[0]) return "There is nothing left in the queue to rewind";
                if(player.queue[0].isStream) return "Cannot rewind a live audio stream";
                if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct";
                if(amount && (Number(amount) <= 0)) return Flag.fail(amount)
                if(amount && Number(amount)) return Number(amount) * 1000;
                if(amount && ms(amount)) return ms(amount);
            },
            match: "rest",
            prompt:{
              start: "How much would you like to rewind by?",
              retry: "Invalid amount, please try again, must be greater than 0."
            }
          }
      ],
      description: {
        content: "Rewinds through a song.", 
        usage: "rewind [ amount ]",
        examples: [
          "rewind 100",
          "rewind 10s",
          "rewind 1m"
        ]
      },
    });
  }

  async exec (message: Message, { query }: { query: any } ) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(query == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel."));
    if(query == "There is no player for this guild") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(query == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use Rewind Command.`));
    if(query == "Cannot rewind a live audio stream") return message.util!.send(new this.client.Embed(message, colour).setDescription("You cannot rewind a live audio streams."));
    if(query == "There is nothing left in the queue to rewind") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no songs in the queue."));
    query = Number(query)
    let player: Player = await this.client.manager.players.get(message.guild!.id)
    if(player.position - Number(query) < 0) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Cannot rewind ${ms(query)} due to position in song.`));
    player.seek(player.position - query)
    return message.util!.send(new this.client.Embed(message, colour).setDescription(`Rewinded to ${ms(player.position)}`));
  }
}