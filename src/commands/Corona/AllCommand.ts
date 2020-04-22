import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment";

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

  public async exec(message: Message): Promise<Message> {
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json())

    const updated: number = data[0].updated
    const cases: number[] = data.map(x => x.cases)
    const todayCases: number[] = data.map(x => x.todayCases)
    const deaths: number[] = data.map(x => x.deaths)
    const todayDeaths: number[] = data.map(x => x.todayDeaths)
    const recovered: number[] = data.map(x => x.recovered)
    const active: number[] = data.map(x => x.active)
    const critical: number[] = data.map(x => x.critical)
    const casesPerOneMillion: number[] = data.map(x => x.casesPerOneMillion)
    const deathsPerOneMillion: number[] = data.map(x => x.deathsPerOneMillion)
    const tests: number[] = data.map(x => x.tests)
    const testsPerOneMillion: number[] = data.map(x => x.testsPerOneMillion)


    let casecounter: number = 0
    let todayCasescounter: number = 0
    let deathcounter: number = 0
    let todayDeathscounter: number = 0
    let recoveredcounter: number = 0
    let activecounter: number = 0
    let criticalcounter: number = 0
    let casesPerOneMillioncounter: number = 0
    let deathsPerOneMillioncounter: number = 0
    let testscounter: number = 0
    let testsPerOneMillioncounter: number = 0


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

    tests.forEach(element => {
        testscounter += element
    });

    testsPerOneMillion.forEach(element => {
        testsPerOneMillioncounter += element
    });



    return message.util!.send(new this.client.Embed()
            // Cases
        .addField("Cases:",casecounter.toLocaleString(),true)
        .addField("Today Cases:",todayCasescounter.toLocaleString(),true)
        .addField("Active Cases:",activecounter.toLocaleString(),true)
            // Deaths or Critical Cases
        .addField("Deaths:",deathcounter.toLocaleString(),true)
        .addField("Today Deaths:",todayDeathscounter.toLocaleString(),true)
        .addField("Critical Cases:",criticalcounter.toLocaleString(),true)
            // Extra Info
        .addField("Recovered:",recoveredcounter.toLocaleString(),true)
        .addField("Tests:", testscounter.toLocaleString(),true)
        .addField("Cases Per Million:",casesPerOneMillioncounter.toLocaleString(),true)
        .addField("Deaths Per Million:",deathsPerOneMillioncounter.toLocaleString(),true)
        .addField("Tests Per Million:",testsPerOneMillioncounter.toLocaleString(),true)
        .setFooter(`Last Updated:${moment(updated).format("DD/MMM/YYYY hh:mm")}`)
    )
  }
}