import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Utils } from "erela.js";
import { getData } from "spotify-url-info";
import { stripIndents } from "common-tags";

export default class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play"],
      category: "Music",
      channel: "guild",
      args: [
        {
            id: "query",
            type: async (message: Message, song: String) => {
                if(!message.member!.voice.channelID) return "This user is not in a voice channel, ask to join"
                let player = await this.client.manager.players.get(message.guild!.id)
                if(player) {
                    if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct";
                }
                if(message.attachments.size) return message.attachments.first()!.proxyURL
                if(song) return song
            },
            match: "rest",
            prompt:{
                start: "What would you like to play?"
              }
          }
      ],
      description: {
        content: "Plays audio via lavalink.", 
        usage: "play [ url/search query ]",
        examples: ["play ncs"]
      },
    });
  }

  public async exec(message: Message, { query }: { query: any }) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(query == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel."))
    if(query == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use Play Command.`));
    let player: any;
    const { channel } = message.member!.voice
    if (!channel!.joinable) {
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to enter this voice channel."))
    }else if(!channel!.speakable){
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to speak this voice channel."))
    }
    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})
    let data = await getData(query).catch(() => null)
    let counter: number = 0
    if(data) {
        if(data.type == "playlist") {
            for(const track of data.tracks.items){
                this.client.manager.search(track.track.name, message.author).then(async res => {
                    switch (res.loadType) {
                        case "SEARCH_RESULT":
                                counter += 1
                                const tracks = res.tracks.slice(0,10);
                                player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel,
                                    selfDeaf: true,
                                    volume: guild.volume
                                }); 
                                player.queue.add(tracks[0]);
                                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                                if(!player.playing && player.queue.length == 1) player.play();
                        break;
                    }
                })
            }
            setTimeout(async () => {
                message.util!.send(new this.client.Embed(message, colour)
                    .setDescription(stripIndents`Name: \`${data.name}\`\nOwner: \`${data.owner.display_name}\`\nQueued Songs: \`${counter} / ${data.tracks.total}\``)
                    .setThumbnail(data.images[0].url)
                    .setFooter("Results won't be exact due to the songs are searched on youtube")
                )
            },6000)


        } else if (data.type == "artist") {

            for(const track of data.tracks){
                this.client.manager.search(track.name, message.author).then(async res => {
                    switch (res.loadType) {
                        case "SEARCH_RESULT":
                                counter += 1
                                const tracks = res.tracks.slice(0,10);
                                player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel,
                                    selfDeaf: true,
                                    volume: guild.volume
                                }); 
                                player.queue.add(tracks[0]);
                                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                                if(!player.playing && player.queue.length == 1) player.play();
                        break;
                    }
                })
            }

            setTimeout(async () => {
                message.util!.send(new this.client.Embed(message, colour)
                    .setDescription(stripIndents`Songs by: \`${data.name}\`\nFollowers: \`${Number(data.followers.total).toLocaleString()}\`\nGenres: ${data.genres.map(genre => `\`${genre}\``).join(", ")}\nQueued Songs: \`${counter} / ${data.tracks.length}\``)
                    .setThumbnail(data.images[0].url)
                    .setFooter("Results won't be exact due to the songs are searched on youtube")
                )
            },6000)

        } else if (data.type == "track") {


            this.client.manager.search(data.name, message.author).then(async res => {
                switch (res.loadType) {
                    case "SEARCH_RESULT":
                            const tracks = res.tracks.slice(0,10);
                            player = this.client.manager.players.spawn({
                                guild: message.guild,
                                textChannel: message.channel,
                                voiceChannel: channel,
                                selfDeaf: true,
                                volume: guild.volume
                            }); 
                            player.queue.add(tracks[0]);
                            message.react(this.client.emojiList.reaction.accept).catch(() => null)
                            if(!player.playing && player.queue.length == 1) player.play();
                            message.util!.send(new this.client.Embed(message, colour)
                                .setDescription(stripIndents`Song name: \`${data.name}\`\nSong by: \`${data.artists.map(artist => artist.name).join(", ")}\``)
                                .setThumbnail(data.album.images[0].url)
                                .setFooter("Results won't be exact due to the songs are searched on youtube")
                            )
                    break;
                }
            })


        } else {
            message.util!.send(new this.client.Embed(message, colour)
                .setDescription(`Unknown type, will be added soon ${data.type}`)
            )
        }

    } else {

        this.client.manager.search(query, message.author).then(async found => {
            switch (found.loadType) {

                case "TRACK_LOADED":
                    if(found.tracks[0].isStream){
                        if(found.tracks[0].uri.startsWith("https://www.you")){
                        return message.util!.send(new this.client.Embed(message, colour).setDescription("Unfortunately I cannot play youtube streams right now."))
                        }
                    }
                    player = this.client.manager.players.spawn({
                        guild: message.guild,
                        textChannel: message.channel,
                        voiceChannel: channel,
                        selfDeaf: true,
                        volume: guild.volume
                    });
                    player.queue.add(found.tracks[0]);
                    message.react(this.client.emojiList.reaction.accept).catch(() => null)
                    message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.tracks[0].title}.`))
                    if(!player.playing && player.queue.length == 1) player.play();

                break;

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
                    message.react(this.client.emojiList.reaction.accept).catch(() => null)
                    message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.tracks[0].title}.`))
                    if(!player.playing && player.queue.length == 1) player.play();

                break;

                case "PLAYLIST_LOADED":
                    player = this.client.manager.players.spawn({
                        guild: message.guild,
                        textChannel: message.channel,
                        voiceChannel: channel,
                        selfDeaf: true,
                        volume: guild.volume
                    });
            
                    for (const track of found.playlist.tracks){
                        player.queue.add(track)
                        if(!player.playing && player.queue.length == 1) player.play();
                    }
                    message.react(this.client.emojiList.reaction.accept).catch(() => null)
                    const duration = Utils.formatTime(found.playlist.tracks.map(x => x.duration).reduce((a: any ,b: any) => a + b), true)
                    message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
                    
                break;

                case "LOAD_FAILED":
                    message.react(this.client.emojiList.reaction.deny).catch(() => null)
                    message.util!.send(new this.client.Embed(message, colour).setDescription(`No Songs Found.`))
                break;

                case "NO_MATCHES":
                    this.client.manager.search(query, message.author).then(async found => {

                        switch (found.loadType) {

                            case "TRACK_LOADED":
                                if(found.tracks[0].isStream){
                                    if(found.tracks[0].uri.startsWith("https://www.you")){
                                    return message.util!.send(new this.client.Embed(message, colour).setDescription("Unfortunately I cannot play youtube streams right now."))
                                    }
                                }
                                player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel,
                                    selfDeaf: true,
                                    volume: guild.volume
                                });
                                player.queue.add(found.tracks[0]);
                                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                                message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.tracks[0].title}.`))
                                if(!player.playing && player.queue.length == 1) player.play();
                
                            break;
                
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
                                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                                message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.tracks[0].title}.`))
                                if(!player.playing && player.queue.length == 1) player.play();
                
                            break;
                
                            case "PLAYLIST_LOADED":
                                player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel,
                                    selfDeaf: true,
                                    volume: guild.volume
                                });
                        
                                for (const track of found.playlist.tracks){
                                    player.queue.add(track)
                                    if(!player.playing && player.queue.length == 1) player.play();
                                }
                                message.react(this.client.emojiList.reaction.accept).catch(() => null)
                                const duration = Utils.formatTime(found.playlist.tracks.map(x => x.duration).reduce((a: any ,b: any) => a + b), true)
                                message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued: ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
                                
                            break;
                            
                            case "LOAD_FAILED":
                                message.react(this.client.emojiList.reaction.deny).catch(() => null)
                                message.util!.send(new this.client.Embed(message, colour).setDescription(`No Songs Found.`))
                            break; 

                            case "NO_MATCHES":
                                message.react(this.client.emojiList.reaction.deny).catch(() => null)
                                message.util!.send(new this.client.Embed(message, colour).setDescription(`No Songs Found.`))
                            break;
                        }
                    })
                break;
            }
        })
    }
  }
}