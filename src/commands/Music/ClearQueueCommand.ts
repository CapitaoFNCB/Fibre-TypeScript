import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class ClearQueueCommand extends Command {
  constructor() {
    super("clearqueue", {
      aliases: ["clearqueue", "cq", "delqueue"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Clears the current music queue.", 
        usage: "clearqueue",
        examples: [
          "clearqueue",
          "cq",
          "delqueue"
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const player: Player = this.client.manager.players.get(message.guild!.id);
    const { channel } = message.member!.voice;
    if(!player) return message.channel.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use ClearQueue Command."));
    if(!player.queue[1]) return message.util!.send(new this.client.Embed(message, colour).setDescription("There are no songs in the queue to be cleared."));
    player.queue.clear()
    return message.util!.send(new this.client.Embed(message, colour).setDescription("Successfully cleared queue."));
  }
}