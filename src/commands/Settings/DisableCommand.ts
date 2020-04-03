import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class DisableCommand extends Command {
  public constructor() {
    super("disable", {
      aliases: ["disable"],
      category: "Settings",
      args: [
        {
            id: "type",
            type: "string",
            prompt:{
              start: "What would you like to disable?"
            }
          }
      ],
      userPermissions: ["ADMINISTRATOR"],
      description: {
        content: "Disable Command",
        usage: "disable [type]",
        examples: ["disable level"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { type }: { type: String }) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    if(!["level"].includes(type.toLowerCase())){
        return message.util!.send(new MessageEmbed()
            .setDescription("There is no setting with this name")
            .setColor("0491e2")
        )
    }
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})

    if(type.toLowerCase() == "level"){
        if(guild.level == false) return message.util!.send(new MessageEmbed()
            .setDescription("Level System is Already Disabled")
            .setColor("0491e2")
        )
        guild.level = false
        message.util!.send(new MessageEmbed()
            .setDescription("Disabled Level System")
            .setColor("0491e2")
        )
    }
    guild.save()
  }
}