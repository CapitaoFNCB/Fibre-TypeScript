import twemoji from 'twemoji';
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageAttachment } from 'discord.js';

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

        let found = this.client.emojis.cache.get(emoji)

        if(!found){
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
            
        }else{
            if(found.animated){
                image = `https://cdn.discordapp.com/emojis/${found.id}.gif`
                messageAtttachment = new MessageAttachment(image, "emoji.gif")
            }else{
                image = `https://cdn.discordapp.com/emojis/${found.id}.png`
                messageAtttachment = new MessageAttachment(image, "emoji.png")
            }
        }

        return message.util!.send("",messageAtttachment)

    }
}