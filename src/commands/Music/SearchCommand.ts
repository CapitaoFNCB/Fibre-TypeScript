import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Utils } from "erela.js";

export default class SearchCommand extends Command {
  constructor() {
    super("search", {
      aliases: ["search"],
      channel: "guild",
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
        content: "Search Command", 
        usage: "search [search query]",
        examples: ["search ncs"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: any }) {

    let player: any;
    let filter: any;

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to speak this voice channel"))
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
                    self_deaf: true
                });
                player.queue.add(found.tracks[0]);
                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${found.tracks[0].title}`))
                }
                
                let track_data = await this.client.queue.get(message.guild!.id)
                if(!track_data) track_data = await this.client.queue.set(message.guild!.id, { paused: false })
                if(track_data.paused) return;
                if(!player.playing) player.play();

            break;

            case "SEARCH_RESULT":
                let i = 1
                const tracks = found.tracks.slice(0,5);
                const embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                    .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
                    .setDescription(tracks.map(video => `**${i++} -** ${video.title}`))
                    .setFooter("Your response time closes within the next 30 seconds. Use 🗑️ to cancel the selection");

                let send_message = await message.util!.send(embed);

                if(tracks.length > 4) {
                    filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || '5️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
                } else if(tracks.length > 3) {
                    filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
                } else if(tracks.length > 2) {
                    filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
                } else if(tracks.length > 1) {
                    filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
                } else if (tracks.length > 0) {
                    filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
                }

                if(tracks.length > 0) send_message.react("1️⃣")
                if(tracks.length > 1) send_message.react("2️⃣")
                if(tracks.length > 2) send_message.react("3️⃣")
                if(tracks.length > 3) send_message.react("4️⃣")
                if(tracks.length > 4) send_message.react("5️⃣")
                send_message.react("🔼")
                send_message.react("🗑️")
 
                const reactions = send_message.createReactionCollector(filter, { time: 30000 });
                
                reactions.on('collect', async r => {
                    let reacted = this.client.check_emojis(r.emoji.name)

                    if(reacted > 6){
                        if(send_message.deletable)
                            send_message.delete()

                    } else if(reacted == 6){
                        player = this.client.manager.players.spawn({
                            guild: message.guild,
                            textChannel: message.channel,
                            voiceChannel: channel,
                            self_deaf: true
                        });
                        for (const track of tracks){
                            player.queue.add(track)
                        }
                        if(send_message.editable)
                            send_message.edit("", new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(`Queued: All`)
                        )
                        
                        send_message.reactions.removeAll().catch(null)

                        let search_data = await this.client.queue.get(message.guild!.id)
                        if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                        reactions.stop()
                        if(search_data.paused) return;
                        if(!player.playing) player.play();

                    }else{
                        player = this.client.manager.players.spawn({
                            guild: message.guild,
                            textChannel: message.channel,
                            voiceChannel: channel,
                            self_deaf: true
                        });
                        player.queue.add(tracks[reacted - 1])
                        if(send_message.editable)
                            send_message.edit("", new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(`Queued: ${tracks[reacted - 1].title}`)
                        )

                        send_message.reactions.removeAll().catch(null)
                        let search_data = await this.client.queue.get(message.guild!.id)
                        if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                        if(search_data.paused) return;
                        if(!player.playing) player.play();
                    }
                    reactions.stop()
                })
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
                let search_data = await this.client.queue.get(message.guild!.id)
                if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                if(search_data.paused) return;
                if(!player.playing) player.play();
            break;

            case "LOAD_FAILED":
                message.util!.send(new this.client.Embed().setDescription(`No Songs Found`))
            break;

            case "NO_MATCHES":
                this.client.manager.search(query, message.author).then(async found => {

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
                                voiceChannel: channel,
                                self_deaf: true
                            });
                            player.queue.add(found.tracks[0]);
                            if(player.queue.length > 1){
                                message.util!.send(new this.client.Embed().setDescription(`Queued ${found.tracks[0].title}`))
                            }

                            let search_data = await this.client.queue.get(message.guild!.id)
                            if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                            if(search_data.paused) return;
                            if(!player.playing) player.play();

                        break;

                        case "SEARCH_RESULT":
                            let i = 1
                            const tracks = found.tracks.slice(0,5);
                            const embed = new this.client.Embed()
                                .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
                                .setDescription(tracks.map(video => `**${i++} -** ${video.title}`))
                                .setFooter("Your response time closes within the next 30 seconds. Use 🗑️ to cancel the selection");

                            let send_message = await message.util!.send(embed);

                            if(tracks.length > 4) {
                                filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || '5️⃣' || '🗑️') && user.id === message.author.id;
                            } else if(tracks.length > 3) {
                                filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || '🗑️') && user.id === message.author.id;
                            } else if(tracks.length > 2) {
                                filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '🗑️') && user.id === message.author.id;
                            } else if(tracks.length > 1) {
                                filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '🗑️') && user.id === message.author.id;
                            } else if (tracks.length > 0) {
                                filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '🗑️') && user.id === message.author.id;
                            }
            
                            if(tracks.length > 0) send_message.react("1️⃣")
                            if(tracks.length > 1) send_message.react("2️⃣")
                            if(tracks.length > 2) send_message.react("3️⃣")
                            if(tracks.length > 3) send_message.react("4️⃣")
                            if(tracks.length > 4) send_message.react("5️⃣")
                            send_message.react("🗑️")

                            reactions.on('collect', async r => {
                                let reacted = this.client.check_emojis(r.emoji.name)
            
                                if(reacted > 6){
                                    if(send_message.deletable)
                                        send_message.delete()
            
                                } else if(reacted == 6){
                                    player = this.client.manager.players.spawn({
                                        guild: message.guild,
                                        textChannel: message.channel,
                                        voiceChannel: channel,
                                        self_deaf: true
                                    });
                                    for (const track of tracks){
                                        player.queue.add(track)
                                    }
                                    if(send_message.editable)
                                        send_message.edit("", new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                                        .setDescription(`Queued: All`)
                                    )
                                    
                                    send_message.reactions.removeAll().catch(null)
            
                                    let search_data = await this.client.queue.get(message.guild!.id)
                                    if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                                    reactions.stop()
                                    if(search_data.paused) return;
                                    if(!player.playing) player.play();
            
                                }else{
                                    player = this.client.manager.players.spawn({
                                        guild: message.guild,
                                        textChannel: message.channel,
                                        voiceChannel: channel,
                                        self_deaf: true
                                    });
                                    player.queue.add(tracks[reacted - 1])
                                    if(send_message.editable)
                                        send_message.edit("", new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                                        .setDescription(`Queued: ${tracks[reacted - 1].title}`)
                                    )
            
                                    send_message.reactions.removeAll().catch(null)
                                    let search_data = await this.client.queue.get(message.guild!.id)
                                    if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
                                    if(search_data.paused) return;
                                    if(!player.playing) player.play();
                                }
                                reactions.stop()
                            })
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
                            let playlist_data = await this.client.queue.get(message.guild!.id)
                            if(!playlist_data) playlist_data = await this.client.queue.set(message.guild!.id, { paused: false })
                            if(playlist_data.paused) return;
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