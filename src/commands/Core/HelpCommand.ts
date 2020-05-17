import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Category } from "discord-akairo";
import { stripIndents } from "common-tags";
 
export default class Help extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "commands"],
      channel: "guild",
      args: [
        {
          id: "command",
          type: "catAlias",
          default: null
        }
      ],
      category: "Core",
      description: {
        content: "Displays information information for commands or categories.", 
        usage: "help < command | category >",
        examples: [
          "help help", 
          "help radio",
          "help music",
          "help",
        ]
      },
    });
  }

  async exec (message: Message, { command }: { command : any }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const embed = new this.client.Embed(message, colour)
    if (!command) {
      embed
        .setAuthor(`Help Menu - ${message.guild ? message.guild.name : message.author.username}`, message.guild ? message.guild.iconURL({ dynamic: true }) as string : message.author.displayAvatarURL({ dynamic: true }) as string)

      for (const [name, category] of this.handler.categories.filter((c: Category<string, Command>) => !["flag",...(this.client.ownerID.includes(message.author.id) ? ["flag"] : ["Owner", "flag"])].includes(c.id))) {
        embed.addField(`${name} [${category.size}]`, category.filter(cmd => cmd.aliases.length > 0).map(cmd => `\`${this.client.capitalize(cmd.aliases[0])}\``).join(" ") || "There was an error")
      }

    return message.util!.send(embed);
    }

    if(command.ownerOnly == undefined){

      embed
      .setAuthor(`Help - ${command}`, message.guild ? message.guild.iconURL({ dynamic: true }) as string : message.author.displayAvatarURL({ dynamic: true }) as string)
      .setDescription(stripIndents`
        **Commands**: ${command.map(command => `\`${command.id}\``).join(" ")}
      `) 

      return message.util!.send(embed);""

    }

    embed 
      .setAuthor(`Help - ${command}`, message.guild ? message.guild.iconURL({ dynamic: true }) as string : message.author.displayAvatarURL({ dynamic: true }) as string)
      .setDescription(stripIndents`
        **Aliases**: ${command.aliases ? command.aliases.map(alias => `\`${this.client.capitalize(alias)}\``).join(", ") : "Unknown"}
        **Usage**: \`${command.description.usage || "Unknown"}\`
        **Description**: \`${command.description.content || command}\`
        **Examples**: ${command.description.examples.map(x => `\`${x}\``).join(" ")}
      `) 

    return message.util!.send(embed);
  }
}