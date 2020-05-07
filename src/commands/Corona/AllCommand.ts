import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment";

export default class AllCommand extends Command {
  public constructor() {
    super("all", {
      aliases: ["all"],
      category: "Corona",
      channel: "guild",
      description: {
        content: "Shows all coronavirus statistics",
        usage: "all",
        examples: [
          "all"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message): Promise<Message> {
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json())

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setAuthor("Current statistics for coronavirus")
            // Cases
        .addField("Cases:",data.map(x => x.cases).reduce((a, b) => a + b).toLocaleString(),true)
        .addField("Today Cases:",data.map(x => x.todayCases).reduce((a, b) => a + b).toLocaleString(),true)
        .addField("Active Cases:",data.map(x => x.active).reduce((a,b) => a + b).toLocaleString(),true)
            // Deaths or Critical Cases
        .addField("Deaths:",data.map(x => x.deaths).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Today Deaths:",data.map(x => x.todayDeaths).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Critical Cases:",data.map(x => x.critical).reduce((a,b) => a + b).toLocaleString(),true)
           // Extra Info
        .addField("Recovered:",data.map(x => x.recovered).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Tests:", data.map(x => x.tests).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Cases Per Million:",data.map(x => x.casesPerOneMillion).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Deaths Per Million:",data.map(x => x.deathsPerOneMillion).reduce((a,b) => a + b).toLocaleString(),true)
        .addField("Tests Per Million:",data.map(x => x.testsPerOneMillion).reduce((a,b) => a + b).toLocaleString(),true)
        .setFooter(`Last Updated:${moment(data[0].updated).format("DD/MMM/YYYY hh:mm")}`)
        .setImage(`https://xtrading.io/static/layouts/qK98Z47ptC-embed.png?newest=${Date.now()}`)
    )
  }
}