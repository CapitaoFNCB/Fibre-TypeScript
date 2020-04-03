import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch"

export default class RandomCommand extends Command {
  public constructor() {
    super("random", {
      aliases: ["random"],
      category: "Music",
      description: {
        content: "Random Command",
        usage: "random",
        examples: ["random"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message) {
    let player: any;

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new MessageEmbed().setDescription("You Need to be in a voice channel").setColor("0491e2"))
    }else if (!channel.joinable) {
        return message.util!.send(new MessageEmbed().setDescription("I don't seem to have permission to enter this voice channel").setColor("0491e2"))
    }else if(!channel.speakable){
        return message.util!.send(new MessageEmbed().setDescription("I don't seem to have permission to speak this voice channel").setColor("0491e2"))
    }

    fetch('https://fibreapi.glitch.me/song').then(res => res.json()).then(results => {
        this.client.music.search(results.song, message.author).then(found => {
            switch (found.loadType) {
                case "SEARCH_RESULT":
                    const tracks = found.tracks.slice(0,10);
                    player = this.client.music.players.spawn({
                        guild: message.guild,
                        textChannel: message.channel,
                        voiceChannel: message.member!.voice.channel
                    }); 
                    player.queue.add(tracks[0]);
                    if(!player.playing) player.play();

                    if(player.queue.length > 1){
                        message.util!.send(new MessageEmbed().setDescription(`Queued ${found.tracks[0].title}`).setColor("0491e2"))
                    }
                break;
            }
        })
    })
  }
}