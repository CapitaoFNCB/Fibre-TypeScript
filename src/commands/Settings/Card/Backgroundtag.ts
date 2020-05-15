import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class BackgroundTag extends Command {
    public constructor() {
        super("card-background", {
            category: "flag",
            args: [
                {
                    id: "change",
                    type: async (message: Message, word: string) => {
                        let founduser = await this.client.findOrCreateUser({ id: message.author.id })
                        if(!founduser.premium) return "premium only command, reply with need premium"
                        if(message.attachments.size) return await fetch(message.attachments.first()!.proxyURL).catch(() => null)
                        if(word) return await fetch(word).catch(() => null)
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

    public async exec (message: Message, { change }: { change: any }) {
        if(change == "premium only command, reply with need premium") return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour)).setDescription("This is premium use only"))
        let founduser = await this.client.findOrCreateUser({ id: message.author.id })
        let buffered = await change.buffer()
        founduser.backgound = buffered
        founduser.save()
        return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
            .setDescription("Changed card background")
        )
    }   
}