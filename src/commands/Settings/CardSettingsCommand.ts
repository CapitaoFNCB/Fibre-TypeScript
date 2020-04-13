import { Command } from "discord-akairo";
import { Message } from "discord.js";
import isHex from "is-hexcolor"

export default class CardSettingsCommand extends Command {
  public constructor() {
    super("card", {
      aliases: ["card"],
      category: "Settings",
      args: [
        {
            id: "type",
            type: "string",
            prompt:{
              start: "What settings would you like to change?"
            },
        },
        {
            id: "change",
            type: "string",
            default: null
        }
      ],
      description: {
        content: "Card Command",
        usage: "card [type]",
        examples: ["card backgound https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fuej6dnX54XA%2Fmaxresdefault.jpg&f=1&nofb=1", "card text #ffffff"]
      },
      typing: true
    });
  }

  public async exec(message: Message,{ type, change }: { type: String; change: string }){

    const types: String[] = ["background","text","bar"]

    if(!types.includes(type.toLowerCase())) return message.util!.send(new this.client.Embed()
        .setDescription(`There is no setting for ${type.toLowerCase()}\nTry: ${types.map(x => `\`` + x + `\``)}`)
    )

    const founduser = await this.client.findOrCreateUser({id: message.author.id})

    if(!change && message.attachments.size < 1) return message.util!.send(new this.client.Embed()
        .setDescription("No Change Found and or made")
    )

    if(type.toLowerCase() == "background"){

        if(!change){
            founduser.backgound = message.attachments.first()!.proxyURL
            founduser.save() 

            return message.util!.send(new this.client.Embed()
              .setDescription("Changed card background")
            )
        }

        founduser.backgound = change
        founduser.save()

        return message.util!.send(new this.client.Embed()
            .setDescription("Invalid Hex Value")
        )

    }else if(type.toLowerCase() == "text"){

        if(!isHex(change)) return message.util!.send(new this.client.Embed()
          .setDescription("Changed card background")
        )

        founduser.text = change
        founduser.save()

        return message.util!.send(new this.client.Embed()
          .setDescription("Set Progress Text Colour")
        )

    }else{

        if(!isHex(change)) return message.util!.send(new this.client.Embed()
          .setDescription("Invalid Hex Value")
        )

        founduser.barcolour = change
        founduser.save()

        return message.util!.send(new this.client.Embed()
          .setDescription("Set Progress Bar Colour")
        )
    }
  }
}