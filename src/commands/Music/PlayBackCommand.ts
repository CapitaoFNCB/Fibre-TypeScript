import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PlayBackCommand extends Command {
  public constructor() {
    super("playback", {
      aliases: ["playback","pb"],
      category: "Music",
      description: {
        content: "Playback Command",
        usage: "playback",
        examples: ["playback","pb"]
      },
    });
  }

  public async exec(message: Message) {

    let guildData = await this.client.findOrCreateGuild({ id: message.guild!.id });
    
    if(!guildData.last_playing.length) return message.util!.send(new this.client.Embed()
        .setDescription("Play something first before you can use this")
    )

    let player: any;

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new this.client.Embed().setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to speak this voice channel"))
    }

    this.client.manager.search(guildData.last_playing, message.author).then(found => {
        switch (found.loadType) {
            case "TRACK_LOADED":

                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel
                });

                player.queue.add(found.tracks[0]);
                if(!player.playing) player.play();

                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed().setDescription(`Queued ${found.tracks[0].title}`))
                }
            break;

            case "LOAD_FAILED":
                message.util!.send(new this.client.Embed().setDescription(`No Songs Found`))
            break;

            case "NO_MATCHES":
                message.util!.send(new this.client.Embed().setDescription(`No Songs Found`))
            break;
        }
    })
  }
}