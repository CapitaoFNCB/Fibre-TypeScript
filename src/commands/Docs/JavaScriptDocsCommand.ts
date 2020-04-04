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
    });
  }

  public async exec(message: Message, { query }: { query: string }) {
    await fetch(`https://mdn.pleb.xyz/search?q=${query}`).then(res => res.json()).then(body => {
        let { Summary, URL, Title, Tags } = body;

        let embed = new this.client.Embed()
            .setAuthor(`JavaScript: ${Title}`, 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', `https://developer.mozilla.org${URL}`)
            .setDescription(Summary.replace(/<[^>]*>?/gm, '') + `\nTags:\n${Tags.map(x => x).join(", ")}`)

        message.util!.send(embed)
    })
  }
}