import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class LoopCommand extends Command {
  public constructor() {
    super("loop", {
      aliases: ["loop"],
      category: "Music",
      channel: "guild",
      description: {
        content: "Loop Command",
        usage: "loop [ track | queue | none ]",
        examples: ["tag create pizza ez"]
      },
      typing: true
    });
  }
  public *args(): object {
    const method = yield {
        type: [
            ["tag-trackloop", "track", "single", "current", "t"],
            ["tag-queueloop", "queue", "all", "q"],
            ["tag-loopnone", "none", "no", "0", "n"],
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id }, this.client)

            let prefix = guild.prefix

            return new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Invalid Usage:\nRun: \`${prefix}help loop\``)
        }
    }

    return Flag.continue(method);

  }
}