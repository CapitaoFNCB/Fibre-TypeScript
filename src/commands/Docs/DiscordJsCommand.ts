import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class DiscordJsCommand extends Command {
  public constructor() {
    super("discordjs", {
      aliases: ["discordjs","djs"],
      category: "Docs",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt: {
                start: "What would you like to search?"
            }
        },

        {
          id: "library",
          type: "string",
          match: "option",
          flag: ["-"],
          default: "stable"
        
        }
      ],
      description: {
        content: "Discord JavaScript Docs Command",
        usage: "djs",
        examples: ["djs util master", "djs util akairo"]
      },
    });
  }

  public async exec(message: Message, { query, library }: { query: string; library: string }) {
    if(!["stable", "master", "rpc", "commando", "akairo", "akairo-master"].includes(library)) return message.util!.send(new this.client.Embed()
      .setDescription("Invalid library")
    )

    await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${library}&q=${query}`).then(res => res.json()).then(body => {

      if(!body) return message.util!.send(new this.client.Embed()
        .setDescription(`Nothing found for ${query}`)
      )

      message.util!.send({embed: body})
    })
  }
}