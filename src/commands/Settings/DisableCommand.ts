import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class DisableCommand extends Command {
  public constructor() {
    super("disable", {
      aliases: ["disable", "dis"],
      category: "Settings",
      channel: "guild",
      description: {
        content: "Disables curtain aspects.",
        usage: "disable [ type ]",
        examples: [
          "disable level"
        ]
      },
    });
  }
  public *args(): object {
    const method = yield {
        type: [
            ["disable-level", "level", "lvl","l"],
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id }, this.client)

            let prefix = guild.prefix

            return new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Invalid Usage:\nRun: \`${prefix}help disable\``)
        }
    }

    return Flag.continue(method);

  }
}
