import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class NotificationsCommand extends Command {
  constructor() {
    super("notifications", {
      aliases: ["notifications", "alerts"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Enabled or Disabled music notifications.", 
        usage: "notifications",
        examples: [
          "notifications",
          "alerts"
        ]
      },
      typing: true
    });
  }

  async exec (message: Message) {

    const player: Player = this.client.manager.players.get(message.guild!.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Notifications Command"));

    let guild = await this.client.guildsData.findOne({ id: message.guild!.id })

    guild.notifications = !guild.notifications

    guild.save()

    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription(`${guild.notifications ? "Enabled" : "Disabled"} Notifications`)
    )
  }
}