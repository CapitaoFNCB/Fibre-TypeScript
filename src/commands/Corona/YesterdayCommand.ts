import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment"

export default class YesterdayCommand extends Command {
  public constructor() {
    super("yesterday", {
      aliases: ["yesterday"],
      category: "Corona",
      channel: "guild",
      args: [
        {
          id: "country",
          type: "string",
          match: "rest",
          prompt:{
            start: "What country would you like to search for?"
          }
        }
      ],
      description: {
        content: "Shows statistics of yesterdays statistics.",
        usage: "yesterday [ country ]",
        examples: [
          "yesterday UK", 
          "yesterday ireland"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { country }: { country: string }): Promise<Message> {
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries?yesterday=true').then(res => res.json())
    const found: any = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())[0]
    const check: any = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())
    if(!check.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Invalid Country \n Check +countrylist for Countries")
    )

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setTitle(`${found.country}'s Statistics (Yesterday)`)
        .addField("Location:", `${found.countryInfo.long} Longitude, ${found.countryInfo.lat} Latitude`)
        .addField("Cases:", found.cases.toLocaleString(), true)
        .addField("Yesterday's Cases:", found.todayCases.toLocaleString(), true)
        .addField("Deaths:", found.deaths.toLocaleString(), true)
        .addField("Yesterday's Deaths:", found.todayDeaths.toLocaleString(), true)
        .addField("Recovered:", found.recovered.toLocaleString(), true)
        .addField("Active Cases:", found.active.toLocaleString(), true)
        .addField("Critical Cases:", found.critical.toLocaleString(),true)
        .addField("Tests:", found.tests == 0 ? "Unknown" : found.tests.toLocaleString(),true)
        .addField("Positive Tests Rate:", found.tests == 0 ? "Unknown" : `${(found.tests / found.cases).toFixed(2)}%` , true)
        .addField("Cases Per Million:", found.casesPerOneMillion.toLocaleString(), true)
        .addField("Deaths Per Million:", found.deathsPerOneMillion.toLocaleString(), true)
        .addField("Tests Per Million:", found.testsPerOneMillion == 0 ? "Unknown" : found.testsPerOneMillion.toLocaleString(),true)
        .setThumbnail(found.countryInfo.flag)
    )
  }
}