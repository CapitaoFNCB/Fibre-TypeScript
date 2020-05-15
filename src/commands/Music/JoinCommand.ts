import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class JoinCommand extends Command {
  constructor() {
    super("join", {
      aliases: ["join", "summon"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Summons bot to your voice channel.", 
        usage: "join",
        examples: ["join"],
      },
    });
  }

  async exec (message: Message): Promise<Message> {

    const { channel } = message.member!.voice

    if(!channel) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("You Need to be in a voice channel")
      )
    
    let player = this.client.manager.players.get(message.guild!.id)
    if(player) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("I'm already in a voice channel")
    )

    if(!channel.joinable) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setDescription("I cannot join this voice channel")
    )

    if(!channel.speakable) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setDescription("I cannot speak this voice channel")
    )

    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})

    player = this.client.manager.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: channel,
        selfDeaf: true,
        volume: guild.volume
    }) 

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setDescription("Successfully joined")
    )
  }
}