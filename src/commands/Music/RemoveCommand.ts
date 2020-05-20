import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class RemoveCommand extends Command {
  constructor() {
    super("remove", {
      aliases: ["remove"],
      channel: "guild",
      category: "Music",
      args: [
        {
            id: "song",
            type: async (message: Message, amount: String) => {
                if(!message.member?.voice.channelID) return "This user is not in a voice channel, ask to join";
                let player = await this.client.manager.players.get(message.guild!.id);
                if(!player) return "there is no player for this guild";
                if(message.member!.voice.channelID !== player.voiceChannel.id) return "This user is in the incorrect voice channel, connect to correct";
                if(amount) return amount;
            },
            match: "rest",
            prompt:{
              start: "What song would you like to remove from the current queue?",
            }
          }
      ],
      description: {
        content: "Removes song from queue.", 
        usage: "remove [ position | song name ]",
        examples: [
          "remove 1",
          "remove 2",
        ]
      },
    });
  }

  async exec (message: Message, { song }: { song: any }) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(song == "This user is not in a voice channel, ask to join") return message.util!.send(new this.client.Embed(message, colour).setDescription("You need to be in a voice channel."));
    if(song == "there is no player for this guild") return message.util!.send(new this.client.Embed(message, colour).setDescription("There is currently no player for this guild."));
    if(song == "This user is in the incorrect voice channel, connect to correct") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You need to be in the same voice channel as me to use Remove Command.`));
    let player: Player = this.client.manager.players.get(message.guild!.id);
    let song_queue = player.queue.map(song => song.title);
    if(isNaN(song)){
      let filtered = song_queue.filter(filter => filter.toLowerCase().includes(song.toLowerCase()));
      if(!filtered.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Couldn't find a song to remove named ${song}`));
      let removed_song = filtered[0];
      let index = song_queue.indexOf(removed_song);
      if(index == 0) return message.util!.send(new this.client.Embed(message, colour).setDescription("You cannot remove a song which is currently playing."));
      player.queue.remove(index)
      return message.util!.send(new this.client.Embed(message, colour).setDescription(`Successfully removed ${removed_song} from the current queue.`));
    }
    if(Number(song) > 0 && Number(song) < player.queue.size){
      let removing_song = player.queue[song];
      player.queue.remove(Number(song));
      return message.util!.send(new this.client.Embed(message, colour).setDescription(`Successfully removed ${removing_song.title} from the current queue.`));
    } else if (Number(song) == 0) {
      return message.util!.send(new this.client.Embed(message, colour).setDescription("You cannot remove a song which is currently playing."));
    } else {
      return message.util!.send(new this.client.Embed(message, colour).setDescription(`The current queue is only ${player.queue.length - 1} songs.`));
    }
  }
}