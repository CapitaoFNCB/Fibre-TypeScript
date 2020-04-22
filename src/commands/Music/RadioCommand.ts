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
        return message.util!.send(new this.client.Embed().setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to speak this voice channel"))
    }

    player = this.client.manager.players.get(message.guild!.id)

    if(player){
      if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed().setDescription("You need to be in the same voice channel as me to use Random Command"));
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

    if(!str.length) return message.util!.send(new this.client.Embed()
        .setDescription("Invalid Radio Stream")
    )

    await this.client.manager.search(str, message.author).then(res => {
      switch (res.loadType){
        case "TRACK_LOADED":
            player = this.client.manager.players.spawn({
                guild: message.guild,
                voiceChannel: channel,
                textChannel: message.channel,
            })
          if(player.queue.length > 0){
            message.util!.send(new this.client.Embed().setDescription(`Queued ${res.tracks[0].title}`))
          }  
          player.queue.add(res.tracks[0])
          if(!player.playing) player.play()
        break; 
        
        case "LOAD_FAILED":
            player = this.client.manager.players.get(message.guild?.id)
            message.util!.send(new this.client.Embed().setDescription(`Invalid Radio Station`))
            if(player){
                if(!player.playing) this.client.manager.players.destroy(message.guild?.id); 
            }
        break;

        case "NO_MATCHES":
            player = this.client.manager.players.get(message.guild?.id)
            message.util!.send(new this.client.Embed().setDescription(`Invalid Radio Station`))
            if(player){
                if(!player.playing) this.client.manager.players.destroy(message.guild?.id); 
            }
        break;     
      }
    })
  }
}