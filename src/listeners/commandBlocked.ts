import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class commandBlockedListener extends Listener {
  public constructor() {
    super("commandBlocked", {
      emitter: "commandHandler",
      event: "commandBlocked"
    });
  }

  public async exec(message: Message, command: Command, reason: String): Promise<Message> {
    
    return message.channel.send(new this.client.Embed().setDescription(reason == "dm" ? "This command can only be ran inside a guild" : reason == "guild" ? "This command cannot be ran in DM's" : "Command couldn't be executed"))

  }
}