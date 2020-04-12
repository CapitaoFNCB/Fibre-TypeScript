import { DuncateApi } from "duncans-api-wrapper";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

const api = new DuncateApi()

export default class KpopCommand extends Command {
  public constructor() {
    super("kpop", {
      aliases: ["kpop"],
      category: "Fun",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            default: null
          }
      ],
      description: {
        content: "Kpop Command",
        usage: "kpop",
        examples: ["kpop"]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string}) {

    let data;

    if(!query){
      data = await api.kpop()
    }else{
      data = await api.kpop(query)
    }

    if(!data) return message.util!.send(new this.client.Embed()
      .setDescription("Unknown Artist")
    )

    message.util!.send(new this.client.Embed()
        .setDescription(`Name: ${data.data.name}\nBand: ${data.data.band}`)
        .setImage(data.data.img)
    )
  }
}