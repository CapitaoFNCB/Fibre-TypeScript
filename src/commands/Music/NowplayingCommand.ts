import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";
import { stripIndents } from "common-tags";
import { Utils } from "erela.js";

export default class NowplayingCommand extends Command {
  constructor() {
    super("nowplaying", {
      aliases: ["nowplaying", "np"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Show your current now playing song.", 
        usage: "nowplaying",
        examples: [
          "nowplaying"
        ]
      },
    });
  }

  async exec (message: Message): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let player: Player = this.client.manager.players.get(message.guild!.id)
    const { channel } = message.member!.voice
    if(!player){
      return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild"))
    } else if(!channel || channel.id !== player.voiceChannel.id) {
      return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Nowplaying Command")); 
    } else if(!player.queue[0]){
      return message.channel.send(new this.client.Embed(message, colour).setDescription("There is nothing in the queue.")); 
    }
    const part = Math.floor((player.position / player.queue[0].duration) * 20);
    let data = await this.client.findOrCreateGuild({id: message.guild!.id})
    return message.util!.send(new this.client.Embed(message, colour)
      .setDescription(stripIndents`🎧 [\`${player.queue[0].title}\`](${player.queue[0].uri})\n\n\`${"▬".repeat(part) + "🔘" + "▬".repeat(20 - (part + 1))} ${player.position < 60000 ? player.position == 0 ? "00:00" : `00:${Utils.formatTime(player.position, true)}` : Utils.formatTime(player.position, true)} / ${player.queue[0].duration < 60000 ? `00:` + Utils.formatTime(player.queue[0].duration, true) : Utils.formatTime(player.queue[0].duration, true)}\``)
      .setFooter(`${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${data.notifications ? "Notifications Enabled" : "Notifications Disabled"} • Requester: ${player.queue[0].requester.tag}`)
      .setThumbnail(player.queue[0].displayThumbnail())
    )
  }
}