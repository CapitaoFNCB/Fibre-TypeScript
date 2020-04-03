import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

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

    const player = this.client.music.players.get(message.guild?.id)
    if(!player){
        return message.util!.send(new MessageEmbed()
            .setDescription("Not Currently in Voice Channel")
            .setColor("0491e2")
        )
    }else{
        this.client.music.players.destroy(message.guild.id)

        return message.util!.send(new MessageEmbed()
        .setDescription("Left Voice Channel")
        .setColor("0491e2")
      )
    }
  }
}