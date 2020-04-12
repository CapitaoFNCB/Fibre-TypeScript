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
            .addField("Name:", `\`${body.name}\``, true)
            .addField("Package Link:", `[Package Link](https://www.npmjs.com/package/${body.name})`, true)
            .addField("Version:", `\`` + `${body["dist-tags"].latest}` + `\``, true)
            .addField("License:", `\`${body.license}\``, true)
            .addField("Author:", `\`${body.author.name}\``, true)
            .addField("Main File:", `\`` + body.versions[body["dist-tags"].latest].main + `\``, true)
            .addField("Types File:", `\`${body.versions[body["dist-tags"].latest] && body.versions[body["dist-tags"].latest].types ? body.versions[body["dist-tags"].latest].types : "None"}\``, true)
            .addField("Modified:", `\`${moment(body.time.modified).format("DD/MMM/YYYY hh:mm")}\``, true)
            .addField("Created:", `\`${moment(body.time.created).format("DD/MMM/YYYY hh:mm")}\``, true)
            .addField("Repository:", `[Repo](${body.repository.url.slice(4)})`,true)
            .addField("Bugs:", `[Bugs](${body.bugs.url})`, true)
            .addField("Homepage:", `[Github](${body.homepage})`, true)
            .addField("Description:", `\`${body.description}\``)
            .addField("Maintainers:", `${body.maintainers.map(x => `\`${x.name}\``).join(" ")}`)
            .addField("Key Words:", body.keywords ? body.keywords.map(x => `\`${this.client.capitalize(x)}\``).join(" ") : `\`None\``)
            .addField("Dependencies:", body.versions[body["dist-tags"].latest].dependencies ? Object.keys(body.versions[body["dist-tags"].latest].dependencies).map(x => `\`${x}\``).join(" ") : "None")
            .setThumbnail(`https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png`)
    
        message.util!.send(embed)
    })
  }
}