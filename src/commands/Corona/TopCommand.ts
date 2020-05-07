import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment";

export default class TopCommand extends Command {
  public constructor() {
    super("top", {
      aliases: ["top"],
      category: "Corona",
      channel: "guild",
      description: {
        content: "Shows the highest amount of cases of coronavirus.",
        usage: "top",
        examples: [
          "top"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {
    let i: number = 0;
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json());
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setAuthor('Top 10 Countries with most cases of Coronavirus')
        .setDescription(data.sort((a,b) => b.cases - a.cases).slice(0,10).map(x => `**${++i}.** ${x.country}: ${x.cases.toLocaleString()}`).join("\n"))
    )
  }
}