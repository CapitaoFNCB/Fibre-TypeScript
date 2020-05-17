import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class PythonCommand extends Command {
  public constructor() {
    super("python", {
      aliases: ["python"],
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
        content: "Python documentation command.",
        usage: "python [ search ]",
        examples: [
          "python list",
          "python sort"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message>{
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let body: any = await fetch(`https://api.duckduckgo.com/?q=python+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Nothing found for ${query}`))

    return message.util!.send(new this.client.Embed(message, colour)

        .setAuthor(`Python`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png', data.AbstractURL)
        .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    )
  }
}