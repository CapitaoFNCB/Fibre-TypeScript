import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class commandStartedListener extends Listener {
  public constructor() {
    super("commandStarted", {
      emitter: "commandHandler",
      event: "commandStarted"
    });
  }

  public async exec(message: Message, command: Command) {
    
    this.client.logger.info(`${message.author.tag} Ran ${this.client.capitalize(command.id)} Command`)

  }
}