import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("reload", {
      aliases: ["reload"],
      category: "Owner",
      description: {
        content: "Reload Command",
        usage: "reload",
        examples: ["reload"]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message) {
    if(!this.client.ownerOnly(message.author.id)) return message.util!.send(new this.client.Embed()
      .setDescription("Owner Only Command")
    )

    this.client.shard!.broadcastEval(`(async () => { await this.commandHandler.reloadAll(), this.logger.info("Reloaded All Commands") })() `)
    return message.util!.send(new this.client.Embed()
      .setDescription("Reloaded All Commands!")
    )
  }
}