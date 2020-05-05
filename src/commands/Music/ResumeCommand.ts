import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ResumeCommand extends Command {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Resume Command", 
        usage: "resume",
        examples: ["resume"]
      },
      typing: true
    });
  }

  async exec (message: Message) {

    const player = this.client.manager.players.get(message.guild!.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Leave Command"));
    
    let stats = this.client.queue.get(message.guild!.id)

    if(!stats) stats = await this.client.queue.set(message.guild!.id, { paused: false })

    if(!stats.paused)  return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Already Resumed")
    )  

    this.client.queue.set(message.guild!.id, { paused: false })
    player.pause(false)

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Resumed Music")
    )
  }
}