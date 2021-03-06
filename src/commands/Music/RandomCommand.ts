import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class RandomCommand extends Command {
  public constructor() {
    super("random", {
      aliases: ["random"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Gets a random song from an api and plays it.",
        usage: "random",
        examples: ["random"]
      },
    });
  }

  public async exec(message: Message) {
    let player: any;

    const { channel } = message.member!.voice
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if (!channel) {
        return message.util!.send(new this.client.Embed(message, colour).setDescription("You Need to be in a voice channel."))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to enter this voice channel."))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to speak this voice channel."))
    }

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
      if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Random Command."));
    }

    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})

    fetch('https://fibreapi.glitch.me/song').then(res => res.json()).then(results => {
        this.client.manager.search(results.song, message.author).then(async found => {
            switch (found.loadType) {
                case "SEARCH_RESULT":
                    const tracks = found.tracks.slice(0,10);
                    player = this.client.manager.players.spawn({
                      guild: message.guild,
                      textChannel: message.channel,
                      voiceChannel: channel,
                      selfDeaf: true,
                      volume: guild.volume
                  });
                    player.queue.add(tracks[0]);
                    message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued ${found.tracks[0].title}.`))
                    if(!player.playing && player.queue.length == 1) player.play();
                break;
            }
        })
    })
  }
}