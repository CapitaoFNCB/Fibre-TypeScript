import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-edit", {
            args: [
                {
                    id: "tag",
                    prompt: {
                        start: "Please provide a tag to edit"
                    }
                },

                {
                    id: "content",
                    type: "text",
                    match: "rest",
                    prompt: {
                        start: "Please provide the new content for this tag"
                    }
                }
            ],
        });
    }

    public async exec(message: Message, { tag, content }: { tag: string; content: string; }) {

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


        let filtered = guild.customCommands.filter((c) => c.name !== tag.toLowerCase());

        filtered.push({
            name: command.name.toLowerCase(),
            answer: content,
            created: command.created,
            modified: Date.now(),
            creater: command.creater,
            editor: message.author.id
        })

        guild.customCommands = filtered
        guild.save()
    }
}