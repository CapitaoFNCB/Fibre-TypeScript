import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-trackloop", {
            category: "flag",
        });

    }

    public async exec (message: Message) {
        let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
        let player: Player = this.client.manager.players.get(message.guild!.id)

        const { channel } = message.member!.voice;

        if(!player) return message.channel.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
        if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, colour).setDescription("You need to be in the same voice channel as me to use Loop Command."));
        if(player.trackRepeat) return message.channel.send(new this.client.Embed(message, colour).setDescription("Already looping track."));
        player.setTrackRepeat(true)

        return message.util!.send(new this.client.Embed(message, colour).setDescription("Looping Track"))

    }
}