import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class DiscordJsCommand extends Command {
  public constructor() {
    super("discordjs", {
      aliases: ["discordjs","djs"],
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
        },
      ],
      description: {
        content: "Shows discord.js documentation.",
        usage: "djs [ search ]",
        examples: [
          "djs util master", 
          "djs util akairo",
          "djs util commando",
          "djs util akairo-master",
          "djs destroy rpc"
        ]
      },
    });
  }

  public async exec(message: Message, { query } : { query: string }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let search: string[] = query.split(" ")

    let data: any = this.library(search)

    if(!data.searching) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Include a search query aswell.`));

    let found: any = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${data.searchlibrary}&q=${data.searching}`)

    if(found.status != 200) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error when searching (Api Could Be Down)."))

    if(!found) return message.util!.send(new this.client.Embed(message, colour)
      .setDescription(`Nothing found for ${data.searching}`)
    )
    let raw = await found.json();

    if(!raw) return message.util!.send(new this.client.Embed(message, colour)
      .setDescription(`Nothing found for ${data.searching}`)
    )
    return message.util!.send({embed: raw})
  }

  private library(array: string[]){

    let library;
    let searchlibrary;
    let searching;

    if(array.includes('master') || array.includes('stable') || array.includes('rpc') || array.includes('commando') || array.includes('akairo') || array.includes('akairo-master') ){
      library = array.indexOf("master") == -1 ? array.indexOf('stable') == -1 ? array.indexOf('rpc') == -1 ? array.indexOf('commando') == -1 ? array.indexOf('akairo') == -1 ? array.indexOf('akairo-master') : array.indexOf('akairo') : array.indexOf('commando') : array.indexOf('rpc') : array.indexOf('stable') : array.indexOf("master")
      searchlibrary = array.splice(library,1)[0]
      searching = array.join(" ")

      return { searching: searching, searchlibrary: searchlibrary}

    }else{
      searching = array.join(" ")
      searchlibrary = "stable"

      return { searching: searching, searchlibrary: searchlibrary}

    }
  }
}