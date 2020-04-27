<<<<<<< HEAD
import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class ErrorListener extends Listener {
  public constructor() {
    super("listeners-error-client", {
      emitter: "process",
      event: "error"
    });
  }

  public async exec(error: Error, message: Message) {
    this.client.logger.error(`Error: ${error.message}`);

    return message.util?.send(
      new new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).errorEmbed(
        `There was an error while trying to execute this command. Please report this to the developer.\n\n\`${error.message}\``
      )
    );
  }
}
=======
import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class ErrorListener extends Listener {
  public constructor() {
    super("listeners-error-client", {
      emitter: "process",
      event: "error"
    });
  }

  public async exec(error: Error, message: Message) {
    this.client.logger.error(`Error: ${error.message}`);

    return message.util?.send(
      new new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).errorEmbed(
        `There was an error while trying to execute this command. Please report this to the developer.\n\n\`${error.message}\``
      )
    );
  }
}
>>>>>>> 718e2acb7b9c17856ea4e2c1a7c36d330e114774
