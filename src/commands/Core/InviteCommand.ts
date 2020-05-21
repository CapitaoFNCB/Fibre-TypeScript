import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { invite } from "../../utils/Functions";
import { stripIndents } from "common-tags";

export default class PingCommand extends Command {
  constructor() {
    super("invite", {
      aliases: ["invite", "inv"],
      category: "Core",
      channel: "guild",
      description: {
        content: "Displays invite url's for this bot.", 
        usage: "invite",
        examples: [
          "invite",
          "inv"
        ]
      },
    });
  }

  async exec(message: Message): Promise<Message | any> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    return message.util!.send(new this.client.Embed(message, colour)
            .setAuthor(`Invite URL's for ${this.client.user!.tag}`)
            .setDescription(stripIndents`[All Required Permissions](${invite(this.client)})\n[Admininstrator Permissions](https://discord.com/oauth2/authorize?client_id=693118981720113182&permissions=8&scope=bot)\n[No Permissions (Not recommeneded)](https://discord.com/oauth2/authorize?client_id=693118981720113182&permissions=0&scope=bot)`)
        )
    }
}