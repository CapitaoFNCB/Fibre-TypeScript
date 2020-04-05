import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class LeaveCommand extends Command {
  constructor() {
    super("leave", {
      aliases: ["leave"],
      category: "Music",
      description: {
        content: "Leave Command", 
        usage: "leave",
        examples: ["leave"]
      }
    });
  }

  async exec (message: Message) {

    if(!message.guild) return this.client.guildOnly(message.channel);

    const player = this.client.manager.players.get(message.guild?.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed().setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed().setDescription("You need to be in the same voice channel as me to use Leave Command"));
        this.client.manager.players.destroy(message.guild.id)

        return message.util!.send(new this.client.Embed()
        .setDescription("Left Voice Channel")
      )
  }
}