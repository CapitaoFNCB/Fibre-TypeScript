import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class CountrylistCommand extends Command {
  public constructor() {
    super("countrylist", {
      aliases: ["countrylist"],
      category: "Corona",
      description: {
        content: "Countrylist Command",
        usage: "countrylist",
        examples: ["countrylist"]
      },
    });
  }

  public async exec(message: Message) {
    const data = await fetch('https://corona.lmao.ninja/countries').then(res => res.json())
    const final_data = data.map(x => x.country).sort()
    const countries = final_data.slice(0,60)
    const restcontries = final_data.slice(80,120)
    const finalcontries = final_data.slice(120,180)
    const finalcontries2 = final_data.slice(180,)
    message.util!.send(new this.client.Embed()
        .setTitle("Country List")
        .addField(`\u200b`,`\`` + countries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + restcontries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + finalcontries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + finalcontries2.map(x => x).join("\`, \`") + `\``,false)
    )
  }
}