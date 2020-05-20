import { Structures } from "discord.js";
export class FibreMessage extends Structures.get("Message") {

    addReaction(reaction) {
        this.react(reaction)
    }

}

Structures.extend("Message", () => FibreMessage);