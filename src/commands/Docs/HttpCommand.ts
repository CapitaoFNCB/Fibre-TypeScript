import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class HTTPDocsCommand extends Command {
  public constructor() {
    super("http", {
      aliases: ["http"],
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
        content: "HTTP documentation command.",
        usage: "http [ search ]",
        examples: [
          "http authentication"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {

    let body: any = await fetch(`https://api.duckduckgo.com/?q=HTTP+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))

    let embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setAuthor(`HTTP`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/HTTP_logo.svg/1200px-HTTP_logo.svg.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    return message.util!.send(embed)
  }
}