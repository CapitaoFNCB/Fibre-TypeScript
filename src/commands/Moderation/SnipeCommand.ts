import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

export default class SnipeCommand extends Command {
  constructor() {
    super("snipe", {
      aliases: ["snipe"],
      category: "Moderation",
      channel: "guild",
      args: [
        {
          id: "channel",
          type: "channel",
          match: "rest",
          default: (message: Message) => message.channel
        },
      ],
      userPermissions: "MANAGE_MESSAGES",
      description: {
        content: "Shows deleted messages. (limit: 10 messages)", 
        usage: "snipe < channel >",
        examples: [
          "snipe",
          "snipe general"
        ]
      },
    });
  }

  public async exec(message: Message, { channel }: { channel: TextChannel } ): Promise<Message | any> {
        let deleted_message = (this.client.snipes.get(channel.id) || []).reverse()
        let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
        if(!deleted_message.length) return message.util!.send(new this.client.Embed(message, colour).setDescription("No deleted messages.").setAuthor(`Channel: ${this.client.capitalize(channel.name)}`))
        let index = 0
        let selected = deleted_message.slice(0,11).map(message => `**${++index}.** \`${message.author.tag}\` ${message.content.length > 130 ? `${message.content.slice(0,130)}...` : message.content} ${message.image ? `[\`Image\`](${message.image})`: ""}`).join("\n")
        let embed = new this.client.Embed(message, colour)
        return message.util!.send(
          embed.setDescription(selected)
          .setAuthor(`Channel: ${this.client.capitalize(channel.name)}`)
        )
    }
}