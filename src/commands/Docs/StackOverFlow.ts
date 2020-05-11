import { Command } from "discord-akairo";
import { Message } from "discord.js";
import request from "node-superfetch";
import { STACKOVERFLOWKEY } from "../../utils/Config";
import { stripIndents } from "common-tags";
import moment from "moment";

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
    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setThumbnail("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgoingconcern-fe8.kxcdn.com%2Fwp-content%2Fuploads%2F2019%2F03%2FStack-Overflow-logo-1024x768.jpg&f=1&nofb=1")
            .setTitle(body.items[0].title.replace(/&#39;|&quot;/gm, "'"))
            .setURL(body.items[0].link)
            .addField('Thread Creator', stripIndents`[${body.items[0].owner.display_name}](${body.items[0].owner.link})\nUser ID: ${body.items[0].owner.user_id}\nUser Reputation: ${body.items[0].owner.reputation}`, true)
            .addField('Thread', stripIndents`Answered: ${body.items[0].is_answered ? "Yes" : "No"}\nNumber of answers: ${body.items[0].answer_count}\nScore: ${body.items[0].score.toLocaleString()}`, true)
            .addField('Activity', `Created: ${moment(body.items[0].creation_date * 1000).format("\`DD/MMM/YYYY hh:mm\`")}\nLatest Edit: ${moment(body.items[0].last_edit_date * 1000).format("\`DD/MMM/YYYY hh:mm\`")}\nLatest Activity: ${moment(body.items[0].last_activity_date * 1000).format("\`DD/MMM/YYYY hh:mm\`")}`)
            .addField('Tags:', `${body.items[0].tags.map(tag => `\`${tag}\``).join(", ")}`)
        )
  }
}