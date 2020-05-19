import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class DOMDocsCommand extends Command {
  public constructor() {
    super("ruby", {
      aliases: ["ruby"],
      category: "Docs",
      channel: "guild",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt: {
                start: "What would you like to search for?"
            }
          }
      ],
      description: {
        content: "Ruby documentation command.",
        usage: "ruby [ search ]",
        examples: [
          "ruby array",
          "ruby class"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let body: any = await fetch(`https://api.duckduckgo.com/?q=ruby+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error when searching (Api Could Be Down)."))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Nothing found for ${query}.`))

    let embed = new this.client.Embed(message, colour)
      .setAuthor(`Ruby`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Devicon-ruby-plain-wordmark.svg/1200px-Devicon-ruby-plain-wordmark.svg.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    return message.util!.send(embed)
  }
}