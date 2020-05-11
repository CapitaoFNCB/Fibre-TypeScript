import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class LoopCommand extends Command {
  public constructor() {
    super("loop", {
      aliases: ["loop", "l"],
      category: "Music",
      channel: "guild",
      description: {
        content: "Loops currentl music.",
        usage: "loop [ track | queue | none ]",
        examples: [
          "loop track",
          "loop single",
          "loop current",
          "loop t",
          "loop queue",
          "loop all",
          "loop q",
          "loop n",
          "loop n"
        ]
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