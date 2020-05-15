import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class DOMDocsCommand extends Command {
  public constructor() {
    super("git", {
      aliases: ["git"],
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
        content: "Git documentation command.",
        usage: "git [ search ]",
        examples: [
          "git status",
          "git commit",
          "git push",
          "git remote"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {

    let body: any = await fetch(`https://api.duckduckgo.com/?q=git+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))

    let embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
      .setAuthor(`Git`, 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    return message.util!.send(embed)
  }
}