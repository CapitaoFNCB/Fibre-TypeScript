import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
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

    if (!message.member!.voice.channel) {
        return message.channel.send(new MessageEmbed().setDescription("You Need to be in a voice channel").setColor("0491e2"))
    }else if (!message.member!.voice.channel.joinable) {
        return message.channel.send(new MessageEmbed().setDescription("I don't seem to have permission to enter this voice channel").setColor("0491e2"))
    }else if(!message.member!.voice.channel.speakable){
        return message.channel.send(new MessageEmbed().setDescription("I don't seem to have permission to speak this voice channel").setColor("0491e2"))
    }

    this.client.music.search(query, message.author).then(async found => {
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
                let i = 1
                const tracks = found.tracks.slice(0,10);
                const embed = new MessageEmbed()
                .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
                .setDescription(tracks.map(video => `**${i++} -** ${video.title}`))
                .setColor("0491e2")
                .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

                await message.channel.send(embed);

                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                }, { time: 30000, max: 1});

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                    player = this.client.music.players.spawn({
                        guild: message.guild,
                        textChannel: message.channel,
                        voiceChannel: message.member!.voice.channel
                    }); 

                    const track = tracks[Number(m.content) - 1];
                    player.queue.add(track)
                    if(!player.playing) player.play();
                    if(player.queue.length > 1){
                        message.channel.send(new MessageEmbed().setDescription(`Queued ${found.tracks[0].title}`).setColor("0491e2"))
                    }
                });
                collector.on("end", (_, reason) => {
                    if(["time", "cancelled"].includes(reason)) return message.channel.send(new MessageEmbed().setDescription(`Cancelled selection`).setColor("0491e2"))
                });
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