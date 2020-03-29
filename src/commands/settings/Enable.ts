import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("enable", {
      aliases: ["enable"],
      category: "Settings",
      args: [
        {
            id: "type",
            type: "string",
            prompt:{
              start: "What would you like to enable?"
            }
          }
      ],
      description: {
        content: "Enable Command",
        usage: "enable [type]",
        examples: ["enable level"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { type }: { type: String }) {
    if(!message.guild) return this.client.guildOnly(message.channel);

    const types = ["level"]

    if(!types.includes(type.toLowerCase())){
        return message.channel.send(new MessageEmbed()
            .setDescription(`There is no setting with this name\nValid settings: \`${types.map(x => `\`` + x + `\``)}`)
            .setColor("0491e2")
        )
    }
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})

    if(type.toLowerCase() == "level"){
        if(guild.level == true) return message.channel.send(new MessageEmbed()
            .setDescription("Level System is Already Enabled")
            .setColor("0491e2")
        )
        guild.level = true
        return message.channel.send(new MessageEmbed()
            .setDescription("Enabled Level System")
            .setColor("0491e2")
        )
    }

    guild.save()
  }
}