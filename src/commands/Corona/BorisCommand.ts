import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class BorisCommand extends Command {
  public constructor() {
    super("boris", {
      aliases: ["boris"],
      category: "Corona",
      description: {
        content: "Boris Command",
        usage: "boris",
        examples: ["boris"]
      },
      typing: true
    });
  }

  public async exec(message: Message) {
    if(!message.guild) return this.client.guildOnly(message.channel);

    const { channel } = message.member!.voice

    if(!channel) return message.util!.send("You Need to Be in a voice channel")

    let player: any;

    await this.client.manager.search("https://www.youtube.com/watch?v=Sw0J6ZQakdY", message.author).then(res => {
      switch (res.loadType){
        case "TRACK_LOADED":
          player = this.client.manager.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel,
          })
          player.queue.add(res.tracks[0])
          if(!player.playing) player.play()

          if(player.queue.length > 1){
            message.util!.send(new this.client.Embed()
            .setDescription("Queued Boris"))
        }
      }
    })
  }
}