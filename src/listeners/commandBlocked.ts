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
            new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
            .setDescription(`You cannot use the command: \`${command}\` due to its owner only`)
          );
          
          break;

      case "guild":
          return message.util!.send(
            new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
                  .setDescription(`You can only use the command: \`${command}\` in a guild (server)`)
          );
          break;
    
    }
  }
}