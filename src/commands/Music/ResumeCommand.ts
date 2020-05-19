import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ResumeCommand extends Command {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Resumes paused audio.", 
        usage: "resume",
        examples: ["resume"]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const player = this.client.manager.players.get(message.guild!.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Resume Command."));

    if(player.playing)  return message.util!.send(new this.client.Embed(message, colour)
        .setDescription("Already Resumed.")
    )  

    player.pause(false)

    return message.util!.send(new this.client.Embed(message, colour)
        .setDescription("Resumed Music.")
    )
  }
}