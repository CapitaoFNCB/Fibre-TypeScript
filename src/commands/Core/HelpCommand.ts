import { Command, Category } from "discord-akairo";
import { Message } from "discord.js";

export default class Help extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "commands"],
      typing: true,
      args: [
        {
          id: "command",
          type: "commandAlias",
          default: null
        }
      ],
      category: "Core",
      description: {
        content: "Help Command", 
        usage: "help (command name)",
        examples: ["help help", "help eval"]
      },
    });
  }

  async exec (message: Message, { command }: {command : Command}): Promise<Message> {
    if (!command) {
      const embed = new this.client.Embed()
        .setAuthor(`Help Menu - ${message.guild ? message.guild.name : message.author.username}`, message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true }))

      for (const [name, category] of this.handler.categories.filter((c: Category<string, Command>) => !["flag"].includes(c.id))) {
        embed.addField(`${name} [${category.size}]`, category.filter(cmd => cmd.aliases.length > 0).map(cmd => `\`${this.client.capitalize(cmd.aliases[0])}\``).join(", ") || "There was an error")
      }

    return message.util!.send(embed);
    }

    const embed = new this.client.Embed()
      .setAuthor(`Help - ${command}`, message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`
        **Aliases**: ${command.aliases ? command.aliases.map(alias => `\`${this.client.capitalize(alias)}\``).join(", ") : "Unknown"}
        **Usage**: ${command.description.usage || "Unknown"}
        **Description**: ${command.description.content || command}
        **Examples**: ${command.description.examples.map(x => `\`${x}\``).join(" ")}
      `)

    return message.util!.send(embed);
  }
}