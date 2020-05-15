import { Command } from "discord-akairo";
import { Message } from "discord.js";
import isHex from "is-hexcolor";
import fetch from "node-fetch";
import { Flag } from "discord-akairo";

export default class CardSettingsCommand extends Command {
  public constructor() {
    super("card", {
      aliases: ["card"],
      category: "Settings",
      description: {
        content: "Card Command",
        usage: "card [ type ] [ change ]",
        examples: ["card backgound https://cdn.discordapp.com/attachments/688859819246878766/710779734719463454/ok.png", "card colour #ffffff"]
      },
    });
  }

  public *args(): object {
    const method = yield {
        type: [
            ["card-colour", "colour", "color", "c"],
            ["card-background", "background", "b", "back"],
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id }, this.client)

            let prefix = guild.prefix

            return new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Invalid Usage:\nRun: \`${prefix}help tag\``)
        }
    }

    return Flag.continue(method);
  }
}