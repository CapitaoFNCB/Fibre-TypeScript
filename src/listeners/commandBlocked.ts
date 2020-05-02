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
    
    switch (reason) {
      case "owner":
          return message.util!.send(
            new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setDescription(`You cannot use the command: \`${command}\` due to its owner only`)
          );
          
          break;

      case "guild":
          return message.util!.send(
            new this.client.Embed(message, "0491e2")
                  .setDescription(`You can only use the command: \`${command}\` in a guild (server)`)
          );
          break;
    
    }
  }
}