import { Listener } from "discord-akairo";


export default class ErrorListener extends Listener {
  public constructor() {
    super("listeners-error-client", {
      emitter: "process",
      event: "error"
    });
  }

  public async exec(error: Error) {
    this.client.logger.error(`Error: ${error.message}`);
  }
}
