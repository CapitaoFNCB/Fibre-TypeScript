import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class commandBlockedListener extends Listener {
  public constructor() {
    super("commandBlocked", {
      emitter: "commandHandler",
      event: "commandBlocked"
    });
  }

  public async exec(message: Message, command: Command, reason: String): Promise<Message | any> {
    
    console.log(reason)

    switch (reason) {
      case "owner":
          return message.util!.send(
            new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setDescription(`You cannot use the command: \`${command}\` due to its owner only`)
          );
          
          break;
    }
  }
}