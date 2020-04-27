import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class MissingPermissionsListener extends Listener {
    public constructor() {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions"
        });
    }

    public async exec(message: Message, command: Command, type: string, missing: string | string[]): Promise<any> {
        switch (type) {
            case "client":
                return message.util!.send(
                    new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
                        .setDescription(`I am missing the permission${missing.length > 1 ? "s" : ""}: ${this.missingPermissions(message.guild!.me, missing)} to use the command: \`${command}\``)
                );
                break;
            
            case "user":
                return message.util!.send(
                    new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
                        .setDescription(`You are missing the permission${missing.length > 1 ? "s" : ""}: ${this.missingPermissions(message.member, missing)} to use the command: \`${command}\``)
                );
                break;
        }

        switch (missing) {
            case "nsfw":
                return message.util!.send(
                    new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour))
                        .setDescription(`This channel is not \`NSFW\`. Please enter a \`NSFW\` channel.`)
                );
                break;
        }
    }

    public missingPermissions(user: any, permissions: any) {
        const result = user.permissions.missing(permissions).map(
            str =>
                `\`${str
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b(\w)/g, char => char.toUpperCase())}\``
        );

        return result.length > 1
            ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
            : result[0];
    }
}