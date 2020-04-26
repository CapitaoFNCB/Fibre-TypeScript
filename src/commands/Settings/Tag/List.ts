import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-list", {
            category: "flag"
        });
    }

    public async exec (message: Message, { tag }: { tag: string }) {


        let guild = await this.client.findOrCreateGuild({ id: message.guild!.id })

        message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
            .addField(`Avalible Tags:`,guild.customCommands.length > 0 ? guild.customCommands.map(x => `\`${x.name}\``) : "`None`")
        )

    }
}