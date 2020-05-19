import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";
import isHex from "is-hexcolor";

export default class ColourTag extends Command {
    public constructor() {
        super("card-colour", {
            category: "flag",
            args: [
                {
                    id: "change",
                    type: async (message: Message, word: string) => {
                        if(isHex(word)) return word
                        return Flag.fail(word)
                    },
                    prompt: {
                        start: "What would you like the change to be?",
                        retry: "Invalid change, try again."
                    }
                }
            ]
        });
    }

    public async exec (message: Message, { change }: { change: string }) {

        const founduser = await this.client.findOrCreateUser({ id: message.author.id })
        founduser.colour = change
        founduser.save()
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
            .setDescription(`Set colour to ${change}.`)
        )
    }   
}