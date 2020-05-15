import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PlayBackCommand extends Command {
  public constructor() {
    super("playback", {
      aliases: ["playback","pb"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Adds previous song to the queue.",
        usage: "playback",
        examples: ["playback","pb"]
      },
    });
  }

  public async exec(message: Message) {

    let guildData = await this.client.findOrCreateGuild({id: message.guild!.id})
    
    if(!guildData.last_playing.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
        .setDescription("Play something first before you can use this")
    )

    let player: any;

    const { channel } = message.member!.voice

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
        if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Playback Command"));
    }

    if (!channel) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("I don't seem to have permission to speak this voice channel"))
    }

    this.client.manager.search(guildData.last_playing, message.author).then(async found => {
        switch (found.loadType) {
            case "TRACK_LOADED":

                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel,
                    selfDeaf: true,
                    volume: guildData
                });

                player.queue.add(found.tracks[0]);
                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                if(!player.playing && player.queue.length < 2) player.play();
            break;

            case "LOAD_FAILED":
                message.react(this.client.emojiList.reaction.deny).catch(() => null)
                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`No Songs Found`))
            break;

            case "NO_MATCHES":
                message.react(this.client.emojiList.reaction.deny).catch(() => null)
                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription(`No Songs Found`))
            break;
        }
    })
  }
}