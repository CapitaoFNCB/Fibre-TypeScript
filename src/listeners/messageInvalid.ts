import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";


export default class ExitListener extends Listener {
  public constructor() {
    super("listeners-messageInvalid", {
      emitter: "commandHandler",
      event: "messageInvalid"
    });
  }

  public async exec(command: Message) {
    if(!command.guild) return;
    let guild = await this.client.findOrCreateGuild({ id: command.guild!.id}, this.client)
    let args = command.content.slice(guild.prefix.length).trim().split(/ +/g);
    let cmd = args.shift()!.toLowerCase();
    if(!command.content.startsWith(guild.prefix)) return;
    
    let found = guild.customCommands.find((c) => c.name === cmd)

    if(!found) return;
    
    command.util!.send(found.answer)

  }
}
