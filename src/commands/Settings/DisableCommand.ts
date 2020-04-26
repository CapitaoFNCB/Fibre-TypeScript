import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class DisableCommand extends Command {
  public constructor() {
    super("disable", {
      aliases: ["disable"],
      category: "Settings",
      channel: "guild",
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
      typing: true
    });
  }

  public async exec(message: Message, { type }: { type: String }) {

    const perms = await this.client.perms(["ADMINISTRATOR"],message.member)
    if(perms.length > 0) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
        .setDescription(`You need these permissions ${perms.map(x => `\`` + x + `\``)}`)
    )

    const types = ["level"]

    if(!types.includes(type.toLowerCase())){
        return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
            .setDescription("There is no setting with this name")
        )
    }
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})

    if(type.toLowerCase() == "level"){
        if(guild.level == false) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
            .setDescription("Level System is Already Disabled")
        )
        guild.level = false
        message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
            .setDescription("Disabled Level System")
        )
    }
    guild.save()
  }
}