import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class ShuffleCommand extends Command {
  constructor() {
    super("shuffle", {
      aliases: ["shuffle"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Shuffles the current queue.", 
        usage: "skipto",
        examples: [
          "skipto 1",
          "goto 2",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const player: Player = this.client.manager.players.get(message.guild!.id);
    const { channel } = message.member!.voice;
    if(!player) return message.channel.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Shuffle Command."));
    if(player.queue[1] && !player.queue[2]) return message.util!.send(new this.client.Embed(message, colour).setDescription("There is only one song in the queue currently."));
    if(!player.queue[1]) return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no songs in the queue to shuffle."));
    player.queue.shuffle()
    return message.util!.send(new this.client.Embed(message, colour).setDescription("Successfully shuffled current queue."));
  }
}