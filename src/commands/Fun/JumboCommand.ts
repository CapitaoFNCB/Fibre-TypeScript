import twemoji from 'twemoji';
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageAttachment } from 'discord.js';
import fetch from "node-fetch";
import { Canvas } from 'canvas-constructor';

export default class JumboCommand extends Command {
    public constructor() {
      super("jumbo", {
        aliases: ["jumbo"],
        category: "Fun",
        args: [
          {
              id: "query",
              type: "string",
              match: "rest",
              prompt: {
                  start: "Who would you like to search for?"
              }
            }
        ],
        description: {
          content: "Jumbo Command",
          usage: "jumbo [search]",
          examples: ["jumbo 🏓"]
        },
        typing: true
      });
    }
    public async exec(message: Message, { query }: { query: string }): Promise<Message> {

        let emoji = query.split(":").slice(-1).toString().slice(0,-1)
        let image;
        let text;
        let messageAtttachment;
        let data;

        if(!Number(emoji)) {
            text = twemoji.parse(query);

            if(!text.startsWith("<img")){
                return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
                    .setDescription("I Cannot Find This Emoji")
                )
            }

            let pos = text.indexOf("src");
            text = text.substring(pos + 5);
            text = text.substring(0, text.length - 3);
            image = text
            data = await fetch(image)
            let canvas = new Canvas(200,200)
                .addImage(await data.buffer(), 0, 0,200, 200)
            messageAtttachment = new MessageAttachment(canvas.toBuffer(), `emoji.png`)
        } else {
            data = await fetch(`https://cdn.discordapp.com/emojis/${emoji}.gif?size=2048`)
            if(data.status == 200){
                messageAtttachment = new MessageAttachment(await data.buffer(), `emoji.gif`)

            }else{
                data = await fetch(`https://cdn.discordapp.com/emojis/${emoji}.png?size=2048`)
                let canvas = new Canvas(200,200)
                    .addImage(await data.buffer(), 0, 0,200, 200)
                messageAtttachment = new MessageAttachment(canvas.toBuffer(), `emoji.png`)
            }
        }

        return message.util!.send("",messageAtttachment)

    }
}