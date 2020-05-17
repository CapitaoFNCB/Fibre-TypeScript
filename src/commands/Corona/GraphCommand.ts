import { Command } from "discord-akairo";
import { Message, MessageAttachment } from "discord.js";
import fetch from "node-fetch";
import { CanvasRenderService } from 'chartjs-node-canvas';

export default class GraphCommand extends Command {
  public constructor() {
    super("graph", {
      aliases: ["graph"],
      category: "Corona",
      channel: "guild",
      args: [
        {
          id: "country",
          type: "string",
          match: "rest",
          default: null
        }
      ],
      description: {
        content: "Shows a graph of coronavirus statistics.",
        usage: "graph < country >",
        examples: [
          "graph ireland", 
          "graph"
        ]
      },
    });
  }

  public async exec(message: Message, { country }: { country: any }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let image: any;
    await fetch('https://coronavirus-tracker-api.herokuapp.com/all').then(r => r.json()).then(async r => {
      let v = Object.keys(r.confirmed.locations[0].history)
      const canvasRenderService = new CanvasRenderService(800, 400, (ChartJS) => {
        ChartJS.plugins.register({
          beforeDraw: (chart) => {
            chart.ctx.fillStyle = "#121212";
            chart.ctx.fillRect(0, 0, chart.width, chart.height);
          }
        })
      });
      let check
      let confirmed
      let deaths
      let recovered
      let active: number[] = [];

      if(country){
        check = r.confirmed.locations.filter(u => u["country"].toLowerCase() == country.toLowerCase())
        if(!check.length) return;
        confirmed = r.confirmed.locations.filter(u => u["country"].toLowerCase() == country.toLowerCase()).map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b);
        deaths = r.deaths.locations.filter(u => u["country"].toLowerCase() == country.toLowerCase()).map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b);
        recovered = r.recovered.locations.filter(u => u["country"].toLowerCase() == country.toLowerCase()).map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b);

        for(let i = 0; i < confirmed.length; i++){
          active.push((confirmed[i] - recovered[i]) - deaths[i])
        }

      }else{
        confirmed = r.confirmed.locations.map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b)
        deaths = r.deaths.locations.map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b)
        recovered = r.recovered.locations.map(u=>Object.values(u.history)).reduce((a, b) => a.map((c, i) => Number(c) + Number(b[i]))).sort((a,b) => a - b)

        for(let i = 0; i < confirmed.length; i++){
          active.push((confirmed[i] - recovered[i]) - deaths[i])
        }

        country = "all statistics"
      }
      


      image = await canvasRenderService.renderToBuffer({
        type: 'line',
      data: {
        labels: v,
        datasets: [
          {
            label: 'Confirmed',
            data: confirmed,
            backgroundColor: 'rgba(181, 157, 0,0.1)',
            borderColor: 'rgba(181, 157, 0,1)',
            borderWidth: 1
          },
          {
            label: 'Deaths',
            data: deaths,
            backgroundColor: 'rgba(237, 24, 38,0.4)',
            borderColor: 'rgba(237, 24, 38,1)',
            borderWidth: 1
          },
          {
            label: 'Recovered',
            data: recovered,
            backgroundColor: 'rgba(30, 227, 82,0.3)',
            borderColor: 'rgba(30, 227, 82,1)',
            borderWidth: 1
          },
          {
            label: 'Active',
            data: active,
            backgroundColor: 'rgba(201, 91, 13, 0.3)',
            borderColor: 'rgba(201, 91, 13, 1)',
            borderWidth: 1
          },
        ]
      },
      options: {
        title: {
          display: true,
          text: this.client.capitalize(country) || "All Statistics",
          fontColor: "white",
          fontSize: 22
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "white"
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: "white"
            }
          }]
        }
      }
    });
   })
   if(!image)return message.util!.send(new this.client.Embed(message, colour).setDescription("No Country with this name"))
   const attachment = new MessageAttachment(image, "image.png") as any;
   const embed = new this.client.Embed(message, colour)
    .attachFiles(attachment)
    .setImage(`attachment://image.png`)
   return message.util!.send(embed)
  }
}