import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class JavaCommand extends Command {
  public constructor() {
    super("c", {
      aliases: ["c"],
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
        content: "Shows C documentation.",
        usage: "C [ search ]",
        examples: [
          "C Array"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message>{

    let body: any = await fetch(`https://api.duckduckgo.com/?q=c+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))

        .setAuthor(`C`, 'https://cdn.iconscout.com/icon/free/png-512/c-programming-569564.png', data.AbstractURL)
        .setDescription(data.Abstract.replace(/<[^>]*>?|&lt;|&gt;/gm, ''))

    )
  }
}