import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class EnableCommand extends Command {
  public constructor() {
    super("reload", {
      aliases: ["reload"],
      category: "Owner",
      args: [
        {
            id: "command",
            type: "commandAlias",
            default: null
          }
      ],
      description: {
        content: "Reload Command",
        usage: "reload",
        examples: ["reload"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { command }) {
    if(!this.client.ownerOnly(message.author.id)) return message.util!.send(new this.client.Embed()
      .setDescription("Owner Only Command")
    )

    if(!command){
      
      this.client.shard!.broadcastEval(`(async () => { await this.commandHandler.reloadAll(), this.listenerHandler.reloadAll(), this.logger.info("Reloaded All Commands") })() `)

      return message.util!.send(new this.client.Embed()
        .setDescription("Reloaded All Commands!")
      )

    }

    this.client.shard!.broadcastEval(`(async () => { await this.commandHandler.modules.get("${command.id}").reload(), this.logger.info("Reloaded ${command.id} Command") })() `)

    return message.util!.send(new this.client.Embed()
      .setDescription(`Reloaded ${command.id} Command!`)
    )

  }
}