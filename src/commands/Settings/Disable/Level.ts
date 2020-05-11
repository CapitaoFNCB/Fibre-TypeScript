import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class DisableLevelCommand extends Command {
    public constructor() {
        super("disable-level", {
            category: "flag",
            typing: true
        });
    }

    public async exec (message: Message) {

        let guild: any = await this.client.guildsData.findOne({id: message.guild!.id})
        if(!guild.level) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setDescription("Level System is Already Disabled")
        )

        guild.level = false

        message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
            .setDescription("Disable Level System")
        )
        guild.save()
    }   
}