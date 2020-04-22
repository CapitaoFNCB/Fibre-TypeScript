import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCOmmand extends Command {
  public constructor() {
    super("tag", {
      aliases: ["tag"],
      category: "Settings",
      channel: "guild",
      description: {
        content: "Tag Command",
        usage: "Tag <create | delete | edit | info | list>",
        examples: ["tag create pizza ez"]
      },
      typing: true
    });
  }
  public *args(): object {
    const method = yield {
        type: [
            ["tag-create", "create", "add"],
            ["tag-delete", "delete", "del", "remove", "rm"],
            ["tag-edit", "edit"],
            ["tag-info", "info", "information"],
            ["tag-list", "list", "ls"]
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id })

            let prefix = guild.prefix

            return new this.client.Embed().setDescription(`Invalid Usage:\nRun: \`${prefix}help tag\``)
        }
    }

    return Flag.continue(method);

  }
}