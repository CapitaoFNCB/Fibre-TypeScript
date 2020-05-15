import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import ms from "ms";

export default class coolDown extends Listener {
  public constructor() {
    super("cooldown", {
      emitter: "commandHandler",
      event: "cooldown"
    });
  }

  public async exec(message: Message, command: Command, remaining: String): Promise<Message | any> {
    return message.util!.send(
        new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
            .setDescription(`You cannot use the command: \`${command}\` for \`${ms(remaining)}\``)
      );
  }
}