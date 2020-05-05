import { Command } from "discord-akairo";
import { Message } from "discord.js";
import radio from "radio-browser"

export default class RadioCommand extends Command {
  public constructor() {
    super("radio", {
      aliases: ["radio"],
      category: "Music",
      channel: "guild",
      args: [
        {
            id: "station",
            type: "string",
            match: "rest",
            prompt:{
              start: "What radio station would you like to listen too?"
            }
          }
      ],
      description: {
        content: "Radio Command",
        usage: "radio [Radio Station]",
        examples: ["radio Kiss Uk"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { station }: { station: any }) {

    const { channel } = message.member!.voice
    let player: any;
    
    if (!channel) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("I don't seem to have permission to speak this voice channel"))
    }

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
      if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Random Command"));
    }

    let filter = {
        limit: 1,
        by: 'name',
        searchterm: station
    }

    let str = "" 
    await radio.getStations(filter).then(data => {
        data.forEach(item => {
            str = item.url
        })
    })

    if(!str.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
        .setDescription("Invalid Radio Stream")
    )

    await this.client.manager.search(str, message.author).then(async res => {
      switch (res.loadType){
        case "TRACK_LOADED":
            player = this.client.manager.players.spawn({
              guild: message.guild,
              textChannel: message.channel,
              voiceChannel: channel,
              self_deaf: true
          });
          if(player.queue.length > 0){
            message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Queued ${res.tracks[0].title}`))
          }  
          player.queue.add(res.tracks[0])
          let search_data = await this.client.queue.get(message.guild!.id)
          if(!search_data) search_data = await this.client.queue.set(message.guild!.id, { paused: false })
          if(search_data.paused) return;
          if(!player.playing) player.play();
        break; 
        
        case "LOAD_FAILED":
          message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`No Songs Found`))
        break;

        case "LOAD_FAILED":
          message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`No Songs Found`))
        break; 
      }
    })
  }
}