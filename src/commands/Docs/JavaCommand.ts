import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class JavaCommand extends Command {
  public constructor() {
    super("java", {
      aliases: ["java"],
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
        content: "Java Docs Command",
        usage: "Java [search]",
        examples: ["Java Array"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message>{

    let body: any = await fetch(`https://api.duckduckgo.com/?q=java+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))

        .setAuthor(`Java`, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fih1.redbubble.net%2Fimage.418233732.0994%2Fflat%2C800x800%2C075%2Cf.u1.jpg&f=1&nofb=1', data.AbstractURL)
        .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    )
  }
}