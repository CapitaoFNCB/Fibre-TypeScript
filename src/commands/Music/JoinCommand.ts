import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

export default class Help extends Command {
  constructor() {
    super("join", {
      aliases: ["join"],
      category: "Music",
      description: {
        content: "Join Command", 
        usage: "join",
        examples: ["join"]
      }
    });
  }

  async exec (message: Message) {

    const voiceChannel = message.member?.voice

    if(!voiceChannel?.channel) return message.channel.send(new MessageEmbed()
        .setDescription("You Need to be in a voice channel"))

    let player = this.client.music.players.get(message.guild?.id)
    if(player) return message.channel.send(new MessageEmbed()
        .setDescription("I'm already in a voice channel"))
    
    player = this.client.music.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: voiceChannel?.channel
    }) 
  }
}