import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { Utils } from "erela.js";

export default class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play"],
      category: "Music",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt:{
              start: "What would you like to play?"
            }
          }
      ],
      description: {
        content: "Play Command", 
        usage: "play [url/search query]",
        examples: ["play ncs"]
      }
    });
  }

  public async exec(message: Message, { query }: { query: any }) {

    let player: any;

    if (!message.member!.voice.channel) {
        return message.channel.send(new MessageEmbed().setDescription("You Need to be in a voice channel").setColor("0491e2"))
    }else if (!message.member!.voice.channel.joinable) {
        return message.channel.send(new MessageEmbed().setDescription("I don't seem to have permission to enter this voice channel").setColor("0491e2"))
    }else if(!message.member!.voice.channel.speakable){
        return message.channel.send(new MessageEmbed().setDescription("I don't seem to have permission to speak this voice channel").setColor("0491e2"))
    }

    /*
    let searchQuery;

    searchQuery = {
        source: "soundcloud",
        query: args.join(" ")
    };

    */

    this.client.music.search(query, message.author).then(found => {
        switch (found.loadType) {

            case "TRACK_LOADED":
                if(found.tracks[0].isStream){
                    if(found.tracks[0].uri.startsWith("https://www.you")){
                    return message.channel.send(new MessageEmbed().setDescription("Unfortunately I cannot play youtube streams right now").setColor("0491e2"))
                    }
                }
                player = this.client.music.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: message.member!.voice.channel
                });   
                player.queue.add(found.tracks[0]);
                if(!player.playing) player.play();

                if(player.queue.length > 1){
                    message.channel.send(new MessageEmbed().setDescription(`Queued ${found.tracks[0].title}`).setColor("0491e2"))
                }
            break;

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
                    message.channel.send(new MessageEmbed().setDescription(`Queued ${found.tracks[0].title}`).setColor("0491e2"))
                }
            break;

            case "PLAYLIST_LOADED":
                player = this.client.music.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: message.member!.voice.channel
                }); 
        
                found.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(found.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.channel.send(new MessageEmbed().setColor("0491e2").setDescription(`Queued ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
                if(!player.playing) player.play()
            break;

            case "LOAD_FAILED":
                message.channel.send(new MessageEmbed().setDescription(`No Songs Found`).setColor("0491e2"))
            break;

            case "NO_MATCHES":
                message.channel.send(new MessageEmbed().setDescription(`No Songs Found`).setColor("0491e2"))
            break;

        }
    })
  }
}