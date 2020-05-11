import { Structures } from "discord.js";
export class FibreMember extends Structures.get("GuildMember") {

    public get owner() {
        return this.id === this.guild.owner?.id
    }

}

Structures.extend("GuildMember", () => FibreMember);