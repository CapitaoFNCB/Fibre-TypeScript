import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix"],
      category: "Settings",
      args: [
        {
            id: "prefix",
            type: "string",
            prompt:{
              start: "What do you want the new prefix too be?"
            }
          }
      ],
      userPermissions: ["ADMINISTRATOR"],
      description: {
        content: "Prefix Command",
        usage: "prefix [new prefix]",
        examples: ["prefix !"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { prefix }: { prefix: String }) {
    if(prefix.length > 5) return message.util!.send(new MessageEmbed()
        .setDescription("The Max length of a prefix is 5")
        .setColor("0491e2")
    )
    const guild = await this.client.findOrCreateGuild({id: message.guild?.id})
    guild.prefix = prefix
    guild.save()

    return message.util!.send(new MessageEmbed()
        .setDescription(`New prefix \`${prefix}\``)
        .setColor("0491e2")
    )
  }
}