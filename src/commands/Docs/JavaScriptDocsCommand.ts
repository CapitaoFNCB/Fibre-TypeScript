import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class JavaScriptDocsCommand extends Command {
  public constructor() {
    super("javascript", {
      aliases: ["javascript", "js", "mdn"],
      category: "Docs",
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
        content: "JavaScript Docs Command",
        usage: "javascript [search]",
        examples: ["javascript map"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {

    let body: any = await fetch(`https://mdn.pleb.xyz/search?q=${query}`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let { Summary, URL, Title, Tags } = await body.json();
    let embed = new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
      .setAuthor(`JavaScript: ${Title}`, 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', `https://developer.mozilla.org${URL}`)
      .setDescription(Summary.replace(/<[^>]*>?/gm, '') + `\n\n**Tags:**\n${Tags.map(x => x).join(", ")}`)

    return message.util!.send(embed)
  }
}