import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("enable", {
      aliases: ["enable", "e", "en"],
      category: "Settings",
      channel: "guild",
      description: {
        content: "Enables surtain aspects.",
        usage: "enable [ type ]",
        examples: [
          "enable level"
        ]
      },
    });
  }
  public *args(): object {
    const method = yield {
        type: [
            ["enable-level", "level", "lvl","l"],
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id }, this.client)

            let prefix = guild.prefix

            return new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Invalid Usage:\nRun: \`${prefix}help enable\``)
        }
    }

    return Flag.continue(method);

  }
}