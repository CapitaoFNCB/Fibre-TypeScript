import { Command } from "discord-akairo";
import { Message } from "discord.js";
import request from "node-superfetch";
import { STACKOVERFLOWKEY } from "../../utils/Config";
import { stripIndents } from "common-tags";

export default class StackCommand extends Command {
  public constructor() {
    super("stackoverflow", {
      aliases: ["stackoverflow","stack"],
      category: "Docs",
      channel: "guild",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt: {
                start: "What would you like to search for?"
            }
          }
      ],
      description: {
        content: "Stackoverflow search command.",
        usage: "stackoverflow [ search ]",
        examples: [
          "stackoverflow array",
          "stackoverflow class"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {

    const { body } = await request.get('http://api.stackexchange.com/2.2/search/advanced').query({ order: 'asc', sort: 'relevance', q: query, site: 'stackoverflow', key: STACKOVERFLOWKEY }) as any;
    if(!body.items.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))
    //body.items[0]
    console.log(body.items[0])
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setTitle(body.items[0].title.replace(/&#39;/gm, "'"))
            .addField('Thread Creator', stripIndents`[${body.items[0].owner.display_name}](${body.items[0].owner.link})\nUser ID: ${body.items[0].owner.user_id}\nUser Reputation: ${body.items[0].owner.reputation}`, true)
            .addField('Tags:', `${body.items[0].tags.map(tag => `\`${tag}\``).join(", ")}`)
        )
  }
}