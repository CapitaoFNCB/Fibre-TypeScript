import { Command } from "discord-akairo";
import { Message } from "discord.js";
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

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new this.client.Embed().setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to speak this voice channel"))
    }

    /*
    let searchQuery;

    searchQuery = {
        source: "soundcloud",
        query: args.join(" ")
    };

    */

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
        if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed().setDescription("You need to be in the same voice channel as me to use Play Command"));
    }

    this.client.manager.search(query, message.author).then(found => {
        switch (found.loadType) {

            case "TRACK_LOADED":
                if(found.tracks[0].isStream){
                    if(found.tracks[0].uri.startsWith("https://www.you")){
                    return message.util!.send(new this.client.Embed().setDescription("Unfortunately I cannot play youtube streams right now"))
                    }
                }
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

            case "SEARCH_RESULT":
                const tracks = found.tracks.slice(0,10);
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel
                }); 
                player.queue.add(tracks[0]);
                if(!player.playing) player.play();

                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed().setDescription(`Queued ${found.tracks[0].title}`))
                }
            break;

            case "PLAYLIST_LOADED":
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel
                }); 
        
                found.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(found.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.util!.send(new this.client.Embed().setDescription(`Queued ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
                if(!player.playing) player.play()
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