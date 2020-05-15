import { Listener } from "discord-akairo";
import { Guild } from "discord.js";

export default class guildCreateListener extends Listener {
  public constructor() {
    super("guildCreate", {
      emitter: "client",
      event: "guildCreate"
    });
  }

  public async exec(guild: Guild) {

    let data = await this.client.findOrCreateGuild({ id: guild.id });
    this.client.logger.info(`Successfully joined ${guild.name} ${data.id}`)

  }
}