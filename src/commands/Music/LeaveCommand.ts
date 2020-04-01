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
        return message.channel.send(new MessageEmbed()
            .setDescription("Im Not Currently Playing Anything")
            .setColor("0491e2")
        )
    }else{
        this.client.music.players.destroy(message.guild.id)

        return message.channel.send(new MessageEmbed()
        .setDescription("Successfully Stopped Playing")
        .setColor("0491e2")
      )
    }
  }
}