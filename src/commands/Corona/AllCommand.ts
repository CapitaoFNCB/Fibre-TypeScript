import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class AllCommand extends Command {
  public constructor() {
    super("all", {
      aliases: ["all"],
      category: "Corona",
      description: {
        content: "All Command",
        usage: "all",
        examples: ["all"]
      },
      typing: true
    });
  }

  public async exec(message: Message) {
    const data = await fetch('https://corona.lmao.ninja/countries').then(res => res.json())

    console.log("all")
    
    const cases = data.map(x => x.cases)
    const todayCases = data.map(x => x.todayCases)
    const deaths = data.map(x => x.deaths)
    const todayDeaths = data.map(x => x.todayDeaths)
    const recovered = data.map(x => x.recovered)
    const active = data.map(x => x.active)
    const critical = data.map(x => x.critical)
    const casesPerOneMillion = data.map(x => x.casesPerOneMillion)
    const deathsPerOneMillion = data.map(x => x.deathsPerOneMillion)


    let casecounter = 0
    let todayCasescounter = 0
    let deathcounter = 0
    let todayDeathscounter = 0
    let recoveredcounter = 0
    let activecounter = 0
    let criticalcounter = 0
    let casesPerOneMillioncounter = 0
    let deathsPerOneMillioncounter = 0


    cases.forEach(element => {
        casecounter += element
    });

    todayCases.forEach(element => {
        todayCasescounter += element
    });

    deaths.forEach(element => {
        deathcounter += element
    });

    todayDeaths.forEach(element => {
        todayDeathscounter += element
    });

    recovered.forEach(element => {
        recoveredcounter += element
    });

    active.forEach(element => {
        activecounter += element
    });

    critical.forEach(element => {
        criticalcounter += element
    });

    casesPerOneMillion.forEach(element => {
        casesPerOneMillioncounter += element
    });

    deathsPerOneMillion.forEach(element => {
        deathsPerOneMillioncounter += element
    });



    message.util!.send(new this.client.Embed()
            // Cases
        .addField("Cases",casecounter.toLocaleString(),true)
        .addField("Today Cases",todayCasescounter.toLocaleString(),true)
        .addField("Active Cases",activecounter.toLocaleString(),true)
            // Deaths or Critical Cases
        .addField("Deaths",deathcounter.toLocaleString(),true)
        .addField("Today Deaths",todayDeathscounter.toLocaleString(),true)
        .addField("Critical Cases",criticalcounter.toLocaleString(),true)
            // Extra Info
        .addField("Recovered",recoveredcounter.toLocaleString(),true)
        .addField("Cases Per Million",casesPerOneMillioncounter.toLocaleString(),true)
        .addField("Deaths Per Million",deathsPerOneMillioncounter.toLocaleString(),true)
    )
  }
}