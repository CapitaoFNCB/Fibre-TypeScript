import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TagCommand extends Command {
    public constructor() {
        super("tag-edit", {
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    id: "name",
                    type: "tag",
                    prompt: {
                        start: "Please provide a tag to edit",
                        retry: (msg: Message, { failure }: { failure: { value: string} }) =>
                            `The tag with the name of: \`${failure.value}\` doesn't exists. Please try again.`
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
            category: "flag",
        });
    }

    public async exec(message: Message, { name, content }: { name: string; content: string; }) {

        let guild = await this.client.findOrCreateGuild({id: message.guild!.id})

        let command = guild.customCommands.find((c) => c.name === name.toLowerCase())

        let filtered = guild.customCommands.filter((c) => c.name !== name.toLowerCase());

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

        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
            .setDescription(`Updated: \`${name.toLowerCase()}\`.`)
        )
    }
}