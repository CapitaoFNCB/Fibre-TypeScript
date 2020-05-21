import { Structures } from "discord.js";
export class FibreGuild extends Structures.get("Guild") {

    public async getMessage(id){
        for (const channel of this.channels.cache.values() as any) {
            if (channel.type !== 'text') continue;
            try {
                return await channel.messages.fetch(id);
            } catch {}
        }
    }
}

Structures.extend("Guild", () => FibreGuild);