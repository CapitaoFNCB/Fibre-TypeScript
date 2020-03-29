import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
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
      ownerOnly: false
    });
  }

  public async exec(message: Message) {
    const data = await fetch('https://corona.lmao.ninja/countries').then(res => res.json())
    const final_data = data.map(x => x.country).sort()
    const countries = final_data.slice(0,80)
    const restcontries = final_data.slice(80,140)
    const finalcontries = final_data.slice(140,)
    message.channel.send(new MessageEmbed()
        .setColor("0491e2")
        .setTitle("Country List")
        .addField(`\u200b`,`\`` + countries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + restcontries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + finalcontries.map(x => x).join("\`, \`") + `\``,false)
    )
  }
}