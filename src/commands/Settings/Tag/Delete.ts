import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-delete", {
            args: [
                {
                    id: "tag",
                    match: "content",
                    prompt: {
                        start: "Please provide a tag to delete"
                    }
                }
            ],
        });
    }
    public async exec(message: Message, { tag }: { tag: string }) {

        let guild = await this.client.findOrCreateGuild({ id: message.guild!.id })

        let command = guild.customCommands.find((c) => c.name === tag.toLowerCase())

        const perms = await this.client.perms(["ADMINISTRATOR"],message.member)
        if(perms.length > 0) return message.util!.send(new this.client.Embed()
            .setDescription(`You need these permissions ${perms.map(x => `\`` + x + `\``)}`)
        )

        if(!command){
            return message.util!.send(new this.client.Embed()
                .setDescription(`\`${tag.toLowerCase()}\` is not a valid tag name.`)
            )
        }

        guild.customCommands = guild.customCommands.filter((c) => c.name !== tag.toLowerCase());
        guild.save()

        return message.util!.send(new this.client.Embed()
            .setDescription(`Deleted tag: \`${tag.toLowerCase()}\``)
        )
    }
}