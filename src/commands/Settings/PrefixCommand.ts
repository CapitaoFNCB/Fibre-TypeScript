import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix"],
      category: "Settings",
      channel: "guild",
      args: [
        {
            id: "prefix",
            type: "string",
            prompt:{
              start: "What do you want the new prefix too be?"
            }
          }
      ],
      description: {
        content: "Prefix Command",
        usage: "prefix [new prefix]",
        examples: ["prefix !"]
      },
      userPermissions: ["MANAGE_GUILD"]
    });
  }

  public async exec(message: Message, { prefix }: { prefix: String }) {

    if(prefix.length > 5) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("The Max length of a prefix is 5")
    )
    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})
    guild.prefix = prefix
    guild.save()
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription(`New prefix \`${prefix}\``)
    )
  }
}