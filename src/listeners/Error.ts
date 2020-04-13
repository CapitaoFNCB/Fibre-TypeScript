import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class ErrorListener extends Listener {
  public constructor() {
    super("listeners-error-client", {
      emitter: "client",
      event: "error"
    });
  }

  public async exec(error: Error, message: Message) {
    this.client.logger.error(`Error: ${error.message}`);

    return message.util?.send(
      new this.client.Embed(message).errorEmbed(
        `There was an error while trying to execute this command. Please report this to the developer.\n\n\`${error.message}\``
      )
    );
  }
}
