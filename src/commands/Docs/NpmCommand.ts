import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"
import moment from "moment"

export default class NpmCommand extends Command {
  public constructor() {
    super("npm", {
      aliases: ["npm"],
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
        content: "Npm Docs Command",
        usage: "npm [search]",
        examples: ["npm discord.js"]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }) {
    await fetch(`https://registry.npmjs.org/${query}`).then(res => res.json()).then(body => {
        const embed = new this.client.Embed()
            .setAuthor(`NPM | ${body.name}`, `https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png`)
            .setDescription(body.description)
            .addField("Name:", `\`${body.name}\``, true)
            .addField("Package Link:", `[\`Click Me\`](https://www.npmjs.com/package/${body.name})`, true)
            .addField("Version:", `\`` + `${body["dist-tags"].latest}` + `\``, true)
            .addField("License:", `\`${body.license.type ? body.license.type : body.license}\``, true)
            .addField("Author:", body.author ? `\`${body.author.name}\``: "`Unknown`", true)
            .addField("Main File:", `\`${body.versions[body["dist-tags"].latest] && body.versions[body["dist-tags"].latest].main ? body.versions[body["dist-tags"].latest].main : "`Unknown`"}\``, true)
            .addField("Types File:", `\`${body.versions[body["dist-tags"].latest] && body.versions[body["dist-tags"].latest].types ? body.versions[body["dist-tags"].latest].types : "`Unknown`"}\``, true)
            .addField("Modified:", `\`${moment(body.time.modified).format("DD/MMM/YYYY hh:mm")}\``, true)
            .addField("Created:", `\`${moment(body.time.created).format("DD/MMM/YYYY hh:mm")}\``, true)
            .addField("Repository:", body.repository ? `[\`Click Me\`](${body.repository.url.slice(4)})` : "`Unknown`",true)
            .addField("Bugs:", body.bugs ? `[\`Click Me\`](${body.bugs.url})` : "`Unknown`", true)
            .addField("Homepage:", body.homepage ? `[\`Click Me\`](${body.homepage})` : "`Unknown`", true)
            .addField("Maintainers:", `${body.maintainers.map(x => `\`${x.name}\``).join(" ")}`)
            .addField("Key Words:", body.keywords ? body.keywords.map(x => `\`${this.client.capitalize(x)}\``).join(" ") : `\`None\``)
            .addField("Dependencies:", body.versions[body["dist-tags"].latest].dependencies ? Object.keys(body.versions[body["dist-tags"].latest].dependencies).map(x => `\`${x}\``).join(" ") : "`None`")
    
        message.util!.send(embed)
    })
  }
}