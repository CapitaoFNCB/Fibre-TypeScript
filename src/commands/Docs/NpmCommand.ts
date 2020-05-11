import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"
import moment from "moment"
import axios from "axios"
import cheerio from "cheerio"

export default class NpmCommand extends Command {
  public constructor() {
    super("npm", {
      aliases: ["npm"],
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
        content: "Npm package information.",
        usage: "npm [ search ]",
        examples: [
          "npm discord.js",
          "npm duncans-api-wrapper"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {
    
    let data: any = await fetch(`https://registry.npmjs.org/${query}`)

    if(data.error || data.code) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let body: any = await data.json()

    let search = await axios(`https://www.npmjs.com/package/${body.name}`)

    const html: string = search.data;
    const $: any = cheerio.load(html)
    let all: string[] = $.text().split(" ")
    let downloads: string = all.filter(x => x.length > 3).filter(x => x.includes("Downloads") &&  !x.includes("DownloadsWeekly")).toString().split("Version")[0].split("Downloads").filter(x => x.length).toString()
    let size: string = all.filter(x => x.length > 4 && x.includes("Size") || x.includes("Total")).length ? all.filter(x => x.length > 4 && x.includes("Size") || x.includes("Total"))[0].split("Size")[1] + all.filter(x => x.length > 4 && x.includes("Size") || x.includes("Total"))[1].split("Total")[0] : "`Unknown`"
    let files: string | any = all.filter(x => x.length > 4 && x.includes("Files")).length ? all.filter(x => x.length > 4 && x.includes("Files"))[0].split("Files")[1].match(/\d+/) : "`Unknown`"

    if(body.error) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("No Package with this name")  
    )

    if(!body["dist-tags"]) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("This package is missing information")  
    )

    const embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setAuthor(`NPM | ${body.name}`, `https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png`)
      .setDescription(body.description)
      .addField("Name:", `\`${body.name}\``, true)
      .addField("Package Link:", `[\`Click Me\`](https://www.npmjs.com/package/${body.name})`, true)
      .addField("Version:", `\`` + `${body["dist-tags"].latest}` + `\``, true)
      .addField("License:", `\`${body.license ? body.license.type ? body.license.type : body.license : "Unknown"}\``, true)
      .addField("Author:", body.author ? `\`${body.author.name}\``: "`Unknown`", true)
      .addField("Main File:", `\`${body.versions[body["dist-tags"].latest] && body.versions[body["dist-tags"].latest].main ? body.versions[body["dist-tags"].latest].main : "`Unknown`"}\``, true)
      .addField("Types File:", `\`${body.versions[body["dist-tags"].latest] && body.versions[body["dist-tags"].latest].types ? body.versions[body["dist-tags"].latest].types : "`Unknown`"}\``, true)
      .addField("Last Modified:", `\`${moment(body.time.modified).format("DD/MMM/YYYY hh:mm")}\``, true)
      .addField("Created:", `\`${moment(body.time.created).format("DD/MMM/YYYY hh:mm")}\``, true)
      .addField("Repository:", body.repository ? `[\`Click Me\`](${body.repository.url.slice(4)})` : "`Unknown`",true)
      .addField("Bugs:", body.bugs ? `[\`Click Me\`](${body.bugs.url})` : "`Unknown`", true)
      .addField("Homepage:", body.homepage ? `[\`Click Me\`](${body.homepage})` : "`Unknown`", true)
      .addField("This Weeks Downloads:", `\`${downloads.length ? downloads : "Unregistered"}\``,true)
      .addField("Unpacked Size:", `\`${size.toLowerCase().endsWith("b") ? size : "Unknown"}\``,true)
      .addField("Number of Files:", `\`${files}\``,true)
      .addField("Maintainers:", `${body.maintainers.map(x => `\`${x.name}\``).join(" ")}`)
      .addField("Key Words:", body.keywords && body.keywords.length ? body.keywords.map(x => `\`${this.client.capitalize(x)}\``).join(" ") : `\`None\``)
      .addField("Dependencies:", body.versions[body["dist-tags"].latest].dependencies ? Object.keys(body.versions[body["dist-tags"].latest].dependencies).map(x => `\`${x}\``).join(" ") : "`None`")

    return message.util!.send(embed)
  }
}