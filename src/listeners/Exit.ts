import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class ExitListener extends Listener {
  public constructor() {
    super("listeners-exit", {
      emitter: "process",
      event: "exit"
    });
  }

  public async exec() {
    this.client.logger.info(`Exited Process`);
  }
}
