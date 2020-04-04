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
    if(!player){
        return message.util!.send(new this.client.Embed()
            .setDescription("Not Currently in Voice Channel")
        )
    }else{
        this.client.manager.players.destroy(message.guild.id)

        return message.util!.send(new this.client.Embed()
        .setDescription("Left Voice Channel")
      )
    }
  }
}