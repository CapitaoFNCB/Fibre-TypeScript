import { Structures } from "discord.js";
export class FibreTextChannel extends Structures.get("TextChannel") {

    getMessage(id) {
        return this.messages.cache.get(id)
    }

}

Structures.extend("TextChannel", () => FibreTextChannel);