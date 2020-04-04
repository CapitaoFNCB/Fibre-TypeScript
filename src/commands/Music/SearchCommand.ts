import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Utils } from "erela.js";

export default class SearchCommand extends Command {
  constructor() {
    super("search", {
      aliases: ["search"],
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

    this.client.music.search(query, message.author).then(async found => {
        switch (found.loadType) {

            case "TRACK_LOADED":
                if(found.tracks[0].isStream){
                    if(found.tracks[0].uri.startsWith("https://www.you")){
                    return message.util!.send(new this.client.Embed().setDescription("Unfortunately I cannot play youtube streams right now"))
                    }
                }
                player = this.client.music.players.spawn({
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
                let i = 1
                const tracks = found.tracks.slice(0,10);
                const embed = new this.client.Embed()
                    .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
                    .setDescription(tracks.map(video => `**${i++} -** ${video.title}`))
                    .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

                await message.util!.send(embed);

                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                }, { time: 30000, max: 1});

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                    player = this.client.music.players.spawn({
                        guild: message.guild,
                        textChannel: message.channel,
                        voiceChannel: channel
                    }); 

                    const track = tracks[Number(m.content) - 1];
                    player.queue.add(track)
                    if(!player.playing) player.play();
                    if(player.queue.length > 1){
                        message.util!.send(new this.client.Embed().setDescription(`Queued ${found.tracks[0].title}`))
                    }
                });
                collector.on("end", (_, reason) => {
                    if(["time", "cancelled"].includes(reason)) return message.util!.send(new this.client.Embed().setDescription(`Cancelled selection`))
                });
            break;

            case "PLAYLIST_LOADED":
                player = this.client.music.players.spawn({
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