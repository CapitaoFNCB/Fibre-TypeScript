import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class HtmlCommand extends Command {
  public constructor() {
    super("html", {
      aliases: ["html"],
      category: "Docs",
      channel: "guild",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt: {
                start: "What would you like to search?"
            }
          }
      ],
      description: {
        content: "HTML documentation command.",
        usage: "html [ search ]",
        examples: [
          "html div",
          "html nav"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let body: any = await fetch(`https://api.duckduckgo.com/?q=html+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Nothing found for ${query}`))

    let embed = new this.client.Embed(message, colour)
      .setAuthor(`HTML`, 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_960_720.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?|&lt;[^>]*&gt;?/gmi, ''))

    return message.util!.send(embed)
  }
}