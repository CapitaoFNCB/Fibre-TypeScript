import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class PauseCommand extends Command {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Pauses current music.", 
        usage: "pause",
        examples: ["pause"]
      },
      typing: true
    });
  }

  async exec (message: Message) {

    const player: Player = this.client.manager.players.get(message.guild!.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Pause Command"));

    if(player.queue[0].isStream) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("You cannot pause live audio")
    )
    let stats = await this.client.queue.get(message.guild!.id)

    if(!stats) stats = await this.client.queue.set(message.guild!.id, { paused: false })

    if(stats.paused)  return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Already Paused")
    )
    
    this.client.queue.set(message.guild!.id, { paused: true })
    player.pause(true)

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Paused Music")
    )
  }
}