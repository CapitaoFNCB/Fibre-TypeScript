import { Command } from "discord-akairo";
import { Message } from "discord.js";
import radio from "radio-browser";
import { stripIndents } from "common-tags";

export default class RadioCommand extends Command {
  public constructor() {
    super("radio", {
      aliases: ["radio"],
      category: "Music",
      channel: "guild",
      args: [
        {
            id: "station",
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
              start: "What radio station would you like to listen too?"
            }
          }
      ],
      description: {
        content: "Plays live radio radio.",
        usage: "radio [ Radio Station ]",
        examples: ["radio Kiss Uk"]
      },
    });
  }

  public async exec(message: Message, { station }: { station: any }) {

    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(station == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel"))
    if(station == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use Radio Command.`));

    let player: any;
    
    const { channel } = message.member!.voice
    if (!channel!.joinable) {
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel!.speakable){
        return message.util!.send(new this.client.Embed(message, colour).setDescription("I don't seem to have permission to speak this voice channel"))
    }

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
      if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Random Command"));
    }

    let filter = {
        limit: 5,
        by: 'name',
        searchterm: station
    }

    let stations: any[] = [];

    let radios = await radio.getStations(filter)

    for(const radio of radios){
      stations.push(radio)
    }

    if(!stations.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`No radio stations found for \`${station}\``))

    let i: number = 1;

    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})

    if(stations.length == 1){
      return this.client.manager.search(stations[0].url, message.author).then(async res => {
        switch (res.loadType){
          case "TRACK_LOADED":
              player = this.client.manager.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel: channel,
                selfDeaf: true,
                volume: guild.volume
            });
            message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued ${res.tracks[0].title}`))
            player.queue.add(res.tracks[0])
            if(!player.playing && player.queue.length < 2) player.play();
          break; 
          
          case "LOAD_FAILED":
            message.util!.send(new this.client.Embed(message, colour).setDescription(`No Songs Found`))
        break;
          }
        })
    }

    const embed = new this.client.Embed(message, colour)
      .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
      .setDescription(stripIndents`${stations.map(radio => `**${i++} -** ${radio.name}`).join("\n")}`)
      .setFooter("Your response time closes within the next 30 seconds. Use 🗑️ to cancel the selection");

    let send_message = await message.util!.send(embed);
    
    let use_filter: any;

    if(stations.length > 4) {
      use_filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || '5️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
    } else if(stations.length > 3) {
      use_filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
    } else if(stations.length > 2) {
      use_filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
    } else if(stations.length > 1) {
      use_filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
    } else if (stations.length > 0) {
      use_filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || "🔼" || '🗑️') && user.id === message.author.id;
    }

    if(stations.length > 0) send_message.react("1️⃣")
    if(stations.length > 1) send_message.react("2️⃣")
    if(stations.length > 2) send_message.react("3️⃣")
    if(stations.length > 3) send_message.react("4️⃣")
    if(stations.length > 4) send_message.react("5️⃣")
    send_message.react("🗑️")

  const reactions = send_message.createReactionCollector(use_filter, { time: 30000 });
  
  reactions.on('collect', async r => {

    let reacted = this.client.check_emojis(r.emoji.name)

    if(reacted > 6){
      if(send_message.deletable)
          send_message.delete()
    } else {

      this.client.manager.search(stations[reacted - 1].url, message.author).then(async res => {
        switch (res.loadType){
          case "TRACK_LOADED":
              player = this.client.manager.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel: channel,
                selfDeaf: true,
                volume: guild.volume
            });
            send_message.reactions.removeAll().catch(() => null)
            message.util!.send(new this.client.Embed(message, colour).setDescription(`Queued ${res.tracks[0].title}`))
            player.queue.add(res.tracks[0])
            if(!player.playing && player.queue.length < 2) player.play();
          break; 
          
          case "LOAD_FAILED":
            message.util!.send(new this.client.Embed(message, colour).setDescription(`No Songs Found`))
          break;
    
          }
        })
      }
    })
  }
}