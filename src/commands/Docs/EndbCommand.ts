import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios from "axios";

export default class EndbCommand extends Command {
  public constructor() {
    super("endb", {
      aliases: ["endb"],
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
        content: "Endb documentation command.",
        usage: "Endb [ search ]",
        examples: [
          "endb all",
          "endb db",
          "endb endb#set"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }){
    const embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour));
    const { data } = await axios.get('https://raw.githubusercontent.com/chroventer/endb/gh-pages/endb.jsdoc.json');
    const doc = data.find((el) => el.longname.toLowerCase() === query.toLowerCase());
    if (doc) {
        if (Array.isArray(doc.params) && doc.params.length > 0) {
            embed.addField('Parameters',doc.params.map((param) => `\`${param.optional ? `[${param.defaultvalue ? `${param.name}=${param.defaultvalue}` : param.name }]` : param.name}\` **${param.type.names.join(' | ') || 'any'}**\n${param.description || ''}`))
        }
        if (Array.isArray(doc.properties) && doc.properties.length > 0) {
        embed.addField('Properties',
            doc.properties.map((prop) => `- \`${prop.name}\` **${prop.type.names.join(' | ') || 'any'}**\n${prop.description || ''}`).join('\n')
        );
        }
        if (Array.isArray(doc.returns) && doc.returns.length > 0) {
        embed.addField('Returns',`**${doc.returns[0].type.names.join(' | ') || 'any'}**\n${doc.returns[0].description || ''}`);
        }
        if (Array.isArray(doc.examples) && doc.examples.length > 0) {
        embed.addField('Examples', `\`\`\`js\n${doc.examples}\n\`\`\``);
        }
        embed.setAuthor('Endb Docs','https://raw.githubusercontent.com/chroventer/endb/HEAD/media/logo.png',`https://github.com/chroventer/endb/blob/master/src/${doc.meta.filename || ''}#L${doc.meta.lineno || 1}`).setDescription(`[**${doc.longname}**](https://endb.js.org/${doc.$docmaLink})\n${doc.description || ''}`);
    } else {
        const results = data.filter((doclet) => doclet.longname.includes(query.toLowerCase()));
        if (results.length <= 0) return message.util!.send(embed.setDescription(`Nothing found for \`${query}\``));
        const doclets = results.map((doclet) => `[**${doclet.longname}**](https://endb.js.org/${doclet.$docmaLink})`).join('\n');
        embed.setTitle('Search Results:').setDescription(doclets);
      }
      message.util!.send(embed);
    }
};
