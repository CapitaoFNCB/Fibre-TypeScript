import twemoji from 'twemoji';
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageAttachment } from 'discord.js';
import fetch from "node-fetch";

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
        let searchType: string;

        if(!Number(emoji)) {
            text = twemoji.parse(query);

            if(!text.startsWith("<img")){
                return message.util!.send(new this.client.Embed()
                    .setDescription("I Cannot Find This Emoji")
                )
            }

            let pos = text.indexOf("src");
            text = text.substring(pos + 5);
            text = text.substring(0, text.length - 3);
            image = text
            messageAtttachment = new MessageAttachment(image, "emoji.png")
        } else {
            data = await fetch(`https://cdn.discordapp.com/emojis/${emoji}.gif?size=2048`)
            searchType = "gif"
            if(data.status !== 200){
                data = await fetch(`https://cdn.discordapp.com/emojis/${emoji}.png?size=2048`)
                searchType = "png"
            }
            messageAtttachment = new MessageAttachment(await data.buffer(), `emoji.${searchType}`)
        }

        return message.util!.send("",messageAtttachment)

    }
}