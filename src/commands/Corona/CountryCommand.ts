import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment"

export default class CountrylistCommand extends Command {
  public constructor() {
    super("country", {
      aliases: ["country"],
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
        content: "Country statistics for coronavirus.",
        usage: "country [ country ]",
        examples: [
          "country UK", 
          "country ireland",
          "c spain",
        ]
      },
    });
  }

  public async exec(message: Message, { country }: { country: any }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json())
    const found: any = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())[0]
    const check: any = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())
    if(!check.length) return message.util!.send(new this.client.Embed(message, colour)
        .setDescription("Invalid Country \n Check +countrylist for Countries")
    )
    let wikiName: string;
    let wikiImage: string;
    const wikiAliases: any = { 'S. Korea': 'South Korea', 'UK': 'United Kingdom', 'USA': 'United States' };
    const thePrefixedContries: any[] = ['United States', 'Netherlands', 'United Kingdom'];
    if(wikiAliases[found.country]){
      wikiName = wikiAliases[found.country];
    } else {
      wikiName = found.country;
    }

    if(wikiName == "USA") {
      wikiImage = `https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/COVID-19_Outbreak_Cases_in_the_United_States_%28Density%29.svg/640px-COVID-19_Outbreak_Cases_in_the_United_States_%28Density%29.svg.png?1588686006705?newest=${Date.now()}`;
    } else {
      const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${thePrefixedContries.includes(wikiName) ? 'the_' : ''}${wikiName.replace(/' '/gm, '_')}`).then(res => res.text());
      const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
      const ImageLink = ImageRegex.exec(WikiPage);
      let imageLink;
      if (ImageLink) imageLink = ImageLink[1];
      if (imageLink) imageLink += `?newest=${Date.now()}`;
      wikiImage = imageLink;
    }

    let embed = new this.client.Embed(message, colour)
        .setTitle(`${found.country}'s Statistics`)
        .addField("Location:", `${found.countryInfo.long} Longitude, ${found.countryInfo.lat} Latitude`)
        .addField("Cases:", found.cases.toLocaleString(), true)
        .addField("Today Cases:", found.todayCases.toLocaleString(), true)
        .addField("Deaths:", found.deaths.toLocaleString(), true)
        .addField("Today Deaths:", found.todayDeaths.toLocaleString(), true)
        .addField("Recovered:", found.recovered.toLocaleString(), true)
        .addField("Active Cases:", found.active.toLocaleString(), true)
        .addField("Critical Cases:", found.critical.toLocaleString(),true)
        .addField("Tests:", found.tests == 0 ? "Unknown" : found.tests.toLocaleString(),true)
        .addField("Positive Tests Rate:", found.tests == 0 ? "Unknown" : `${(found.tests / found.cases).toFixed(2)}%` , true)
        .addField("Cases Per Million:", found.casesPerOneMillion.toLocaleString(), true)
        .addField("Deaths Per Million:", found.deathsPerOneMillion.toLocaleString(), true)
        .addField("Tests Per Million:", found.testsPerOneMillion == 0 ? "Unknown" : found.testsPerOneMillion.toLocaleString(),true)
        .setThumbnail(found.countryInfo.flag)
        .setFooter(`Last Updated: ${moment(found.updated).format("DD/MMM/YYYY hh:mm")}`)
        if (wikiImage) embed.setImage(wikiImage);
      return message.util!.send(embed)
  }
}