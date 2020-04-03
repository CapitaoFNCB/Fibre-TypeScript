import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";

export default class CountrylistCommand extends Command {
  public constructor() {
    super("country", {
      aliases: ["country"],
      category: "Corona",
      args: [
        {
          id: "country",
          type: "string",
          match: "rest",
          prompt:{
            start: "What country would you like to search?"
          }
        }
      ],
      description: {
        content: "Countrylist Command",
        usage: "country [country]",
        examples: ["country UK", "country ireland"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message, { country }: { country: any }) {
    const data = await fetch('https://corona.lmao.ninja/countries').then(res => res.json())
    const found = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())[0]
    const check = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())
    if(!check.length) return message.util!.send(new MessageEmbed()
        .setColor("0491e2")
        .setDescription("Invalid Country \n Check +countrylist for Countries")
    )
    message.util!.send(new MessageEmbed()
        .setColor("0491e2")
        .setTitle(`${found.country}'s Statistics`)
        .addField("Location", `${found.countryInfo.long} Longitude, ${found.countryInfo.lat} Latitude`)
        .addField("Cases", found.cases.toLocaleString(), true)
        .addField("Today Cases", found.todayCases.toLocaleString(), true)
        .addField("Deaths", found.deaths.toLocaleString(), true)
        .addField("Today Deaths", found.todayDeaths.toLocaleString(), true)
        .addField("Recovered", found.recovered.toLocaleString(), true)
        .addField("Active Cases", found.active.toLocaleString(), true)
        .addField("Critical Cases", found.critical.toLocaleString(),true)
        .addField("Cases Per Million", found.casesPerOneMillion.toLocaleString(), true)
        .addField("Deaths Per Million", found.deathsPerOneMillion.toLocaleString(), true)
        .setThumbnail(found.countryInfo.flag)
    )
  }
}