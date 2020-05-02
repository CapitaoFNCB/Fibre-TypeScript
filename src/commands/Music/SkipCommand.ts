import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class SkipCommand extends Command {
  public constructor() {
    super("skip", {
      aliases: ["skip"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Skip Command",
        usage: "skip",
        examples: ["skip"]
      },
      typing: true
    });
  }

  public async exec(message: Message) {
    const { channel } = message.member!.voice;
    const player = this.client.manager.players.get(message.guild!.id);
    if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Skip Command"));
    const voice_channel = message.guild!.channels.cache.get(player.voiceChannel.id)
    let guild = await this.client.guildsData.findOne({id: message.guild!.id})

    if(message.author.id !== player.queue[0].requester.id){

        if(!guild.skip_users.includes(message.author.id)){


            let users: String[] = guild.skip_users
            users.push(`${message.author.id}`)
            guild.skip_users = users
            guild.save()

            if(voice_channel!.members.filter(r => r.user.bot !== true).size > 4){

                if(guild.skip_users.length > 2){
                    player.stop()

                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                        .setDescription(`Skipped song`))

                }else{
                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                        .setDescription(`Skip Request Received ${guild.skip_users.length}/3`))
                }

            }else if(voice_channel!.members.filter(r => r.user.bot !== true).size > 2){

                if(guild.skip_users.length > 1){
                    player.stop()

                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                        .setDescription(`Skipped song`))

                }else{
                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                        .setDescription(`Skip Request Received ${guild.skip_users.length}/2`))
                }

            }else{
                    player.stop()

                    return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                        .setDescription(`Skipped song`))
            }

        }else{
            return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                .setDescription("You cannot skip twice!")
            )
        }
    }else{
        player.stop()

        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setDescription(`Skipped song`))
    }
  }
}