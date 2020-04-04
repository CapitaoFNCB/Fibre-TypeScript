import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class JoinCommand extends Command {
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

    const { channel } = message.member!.voice

    if(!channel) return message.util!.send(new this.client.Embed()
        .setDescription("You Need to be in a voice channel")
      )

    let player = this.client.manager.players.get(message.guild?.id)
    if(player) return message.util!.send(new this.client.Embed()
        .setDescription("I'm already in a voice channel"))
    
    player = this.client.manager.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: channel
    }) 
  }
}