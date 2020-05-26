import { Command } from "discord-akairo";
import { Message } from "discord.js";

const boosts = {
  0: 2,
  1: 15,
  2: 30,
  3: 30
}

export default class ServerInfoCommand extends Command {
  constructor() {
    super("serverinfo", {
      aliases: ["serverinfo", "si"],
      channel: "guild",
      category: "Info",
      description: {
        content: "Shows server information", 
        usage: "serverinfo",
        examples: [
          "serverinfo",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour);
    return message.util!.send(new this.client.Embed(message, colour)
      .addField("Server Name:", message.guild!.name, true)
      .addField("Server Owner:", message.guild!.owner! ?? "Unknown", true)
      .addField("Server Tier:", `Level: ${message.guild!.premiumTier}\n${message.guild!.premiumSubscriptionCount}/${boosts[message.guild!.premiumTier]} boosts`, true)
      .addField("Server Partnered:", message.guild!.partnered ? "Partnered": "Not Partnered", true)
      .addField("Server Description:", message.guild!.description ?? "No description")
      .addField("Server Features:", message.guild!.features.length ? message.guild!.features.map(feature => feature.split("_").map(feature => feature.slice(0,1).toUpperCase() + feature.slice(1).toLowerCase()).join(" ")).join(", ") : "No server fearures")
      .addField(`Static Emojis [${message.guild!.emojis.cache.filter(emoji => !emoji.animated).size}]:`, message.guild!.emojis.cache.filter(emoji => !emoji.animated).first(15).map(emoji => emoji).length  ? message.guild!.emojis.cache.filter(emoji => !emoji.animated).first(15).map(emoji => emoji).join(" ") : "No Static emojis")
      .addField(`Animated Emojis [${message.guild!.emojis.cache.filter(emoji => emoji.animated).size}]:`, message.guild!.emojis.cache.filter(emoji => emoji.animated).first(15).map(emoji => emoji).length ? message.guild!.emojis.cache.filter(emoji => emoji.animated).first(15).map(emoji => emoji).join(" ") : "No Animated emojis")
      .addField(`Server Roles [${message.guild!.roles.cache.size - 1}]:`, `${message.guild!.roles.cache.first(15).sort((a, b) => b.position - a.position).filter(role => role.name !== "@everyone").map(x => x).join(", ")} ${message.guild!.roles.cache.size - 1 > 15 ? "..." : ""}`)
      .setImage(message.guild!.bannerURL({ format: "png", size: 2048 }) as string)
      .setThumbnail(message.guild!.iconURL({ format: "png", size: 2048, dynamic: true }) as string)
    )
  }
}