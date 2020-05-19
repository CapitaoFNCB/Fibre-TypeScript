import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";
import { Flag } from "discord-akairo";
import ms from "ms";

export default class FastForwardCommand extends Command {
  constructor() {
    super("fastforward", {
      aliases: ["fastforward", "ff"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "query",
            type: async (message: Message, amount: String) => {
                if(!message.member!.voice.channelID) return "This user is not in a voice channel, ask to join";
                let player: Player = await this.client.manager.players.get(message.guild!.id)
                if(!player) return "There is no player for this guild";
                if(!player.queue[0]) return "There is nothing left in the queue to fastforward";
                if(player.queue[0].isStream) return "Cannot fastforward a live audio stream";
                if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct";
                if(amount && (Number(amount) <= 0)) return Flag.fail(amount)
                if(amount && Number(amount)) return Number(amount) * 1000;
                if(amount && ms(amount)) return ms(amount);
            },
            match: "rest",
            prompt:{
              start: "How much would you like to fastforward by?",
              retry: "Invalid amount, try again, must be greater than 0."
            }
          }
      ],
      description: {
        content: "Fast forwards through a song.", 
        usage: "fastforward [ amount ]",
        examples: [
          "fastforward 100",
          "fastforward 10s",
          "ff 1m"
        ]
      },
    });
  }

  async exec (message: Message, { query }: { query: any }): Promise<Message | any> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(query == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel."));
    if(query == "There is no player for this guild") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(query == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use FastForward Command.`));
    if(query == "Cannot fastforward a live audio stream") return message.util!.send(new this.client.Embed(message, colour).setDescription("You cannot fastforward a live audio streams."));
    if(query == "There is nothing left in the queue to fastforward") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no songs in the queue."));
    query = Number(query)
    let player: Player = await this.client.manager.players.get(message.guild!.id)
    if(player.position + Number(query) >= player.queue[0].duration) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Cannot fastforward ${ms(query)} due to song duration.`));
    player.seek(player.position + query)
    return message.util!.send(new this.client.Embed(message, colour).setDescription(`Fast forwared to ${ms(player.position)}`));
  }
}