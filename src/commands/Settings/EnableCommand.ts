import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("enable", {
      aliases: ["enable"],
      category: "Settings",
      channel: "guild",
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
      typing: true
    });
  }

  public async exec(message: Message, { type }: { type: String }) {

    const perms = await this.client.perms(["ADMINISTRATOR"],message.member)
    if(perms.length > 0) return message.util!.send(new this.client.Embed()
        .setDescription(`You need these permissions ${perms.map(x => `\`` + x + `\``)}`)
    )

    const types = ["level"]

    if(!types.includes(type.toLowerCase())){
        return message.util!.send(new this.client.Embed()
            .setDescription(`There is no setting with this name\nValid settings: ${types.map(x => `\`` + x + `\``)}`)
        )
    }
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})

    if(type.toLowerCase() == "level"){
        if(guild.level == true) return message.util!.send(new this.client.Embed()
            .setDescription("Level System is Already Enabled")
        )
        guild.level = true
        message.util!.send(new this.client.Embed()
            .setDescription("Enabled Level System")
        )
    }

    guild.save()
  }
}