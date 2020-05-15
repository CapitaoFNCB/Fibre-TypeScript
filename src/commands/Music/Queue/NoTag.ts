import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-loopnone", {
            category: "flag",
        });

    }

    public async exec (message: Message) {

        let player = this.client.manager.players.get(message.guild!.id)

        const { channel } = message.member!.voice;

        if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("There is no player for this guild."));
        if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Loop Command."));

        player.setQueueRepeat(false)
        player.setTrackRepeat(false)

        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("Looping None"))

    }
}