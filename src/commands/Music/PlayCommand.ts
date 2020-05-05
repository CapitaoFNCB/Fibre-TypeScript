import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Utils } from "erela.js";

export default class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play"],
      category: "Music",
      channel: "guild",
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
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: any }) {

    let player: any;

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to speak this voice channel"))
    }

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
        if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Play Command"));
    }

    this.client.manager.search(query, message.author).then(async found => {
        switch (found.loadType) {

            case "TRACK_LOADED":
                if(found.tracks[0].isStream){
                    if(found.tracks[0].uri.startsWith("https://www.you")){
                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("Unfortunately I cannot play youtube streams right now"))
                    }
                }
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel,
                    selfDeaf: true
                });
                player.queue.add(found.tracks[0]);
                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                }

                let search_data = await this.client.queue.get(message.guild!.id)
                if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                if(search_data.paused) return;
                if(!player.playing) player.play();

            break;

            case "SEARCH_RESULT":
                const tracks = found.tracks.slice(0,10);
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel,
                    selfDeaf: true
                }); 
                player.queue.add(tracks[0]);
                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                }
                let track_data = await this.client.queue.get(message.guild!.id)
                if(!track_data) track_data = await this.client.queue.set(message.guild!.id, { paused: false })
                if(track_data.paused) return;
                if(!player.playing) player.play();

            break;

            case "PLAYLIST_LOADED":
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel,
                    selfDeaf: true
                });
        
                found.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(found.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));


                let data = await this.client.queue.get(message.guild!.id)
                if(!data) data = await this.client.queue.set(message.guild!.id, { paused: false })
                if(data.paused) return;
                if(!player.playing) player.play();
                
            break;

            case "LOAD_FAILED":
                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`No Songs Found`))
            break;

            case "NO_MATCHES":
                this.client.manager.search(query, message.author).then(async found => {

                    switch (found.loadType) {

                        case "TRACK_LOADED":
                            if(found.tracks[0].isStream){
                                if(found.tracks[0].uri.startsWith("https://www.you")){
                                return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("Unfortunately I cannot play youtube streams right now"))
                                }
                            }
                            player = this.client.manager.players.spawn({
                                guild: message.guild,
                                textChannel: message.channel,
                                voiceChannel: channel,
                                self_deaf: true
                            });
                            player.queue.add(found.tracks[0]);
                            if(player.queue.length > 1){
                                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                            }
            
                            let search_data = await this.client.queue.get(message.guild!.id)
                            if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                            if(search_data.paused) return;
                            if(!player.playing) player.play();
            
                        break;
            
                        case "SEARCH_RESULT":
                            const tracks = found.tracks.slice(0,10);
                            player = this.client.manager.players.spawn({
                                guild: message.guild,
                                textChannel: message.channel,
                                voiceChannel: channel,
                                self_deaf: true
                            });
                            player.queue.add(tracks[0]);
                            if(player.queue.length > 1){
                                message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                            }
                            let track_data = await this.client.queue.get(message.guild!.id)
                            if(!track_data) track_data = await this.client.queue.set(message.guild!.id, { paused: false })
                            if(track_data.paused) return;
                            if(!player.playing) player.play();
            
                        break;
            
                        case "PLAYLIST_LOADED":
                            player = this.client.manager.players.spawn({
                                guild: message.guild,
                                textChannel: message.channel,
                                voiceChannel: channel,
                                self_deaf: true
                            });
                    
                            found.playlist.tracks.forEach(track => player.queue.add(track));
                            const duration = Utils.formatTime(found.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                            message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
            
            
                            let data = await this.client.queue.get(message.guild!.id)
                            if(!data) data = await this.client.queue.set(message.guild!.id, { paused: false })
                            if(data.paused) return;
                            if(!player.playing) player.play();
                            
                        break;
                        
                        case "LOAD_FAILED":
                            message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`No Songs Found`))
                        break; 

                        case "NO_MATCHES":
                            message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`No Songs Found`))
                        break;
                    }
                })
            break;
        }
    })
  }
}