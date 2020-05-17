import { Listener } from "discord-akairo";
import { ErelaClient } from "erela.js"
import { nodes, connection } from "../utils/Config"
import mongoose from "mongoose";
import { MessageEmbed } from "discord.js";

export default class ReadyListener extends Listener {
  public constructor() {
    super("listeners-ready", {
      emitter: "client",
      event: "ready"
    });
  }

  public exec() {
    
    this.client.logger.info(`Started ${this.client.user!.tag}`);
    mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
      this.client.logger.info(`Connected to the Mongodb database!`);
    }).catch((err) => {
      this.client.logger.error("Unable to connect to the Mongodb database. Error:"+err)
    });

    if(this.client.shard!.ids.includes(0)){
      this.client.load(this.client)
      let top_gg = require("../helpers/topgg");
      top_gg.init(this.client);
    }

    this.client.manager = new ErelaClient(this.client, nodes)
    .on("nodeConnect", node => this.client.logger.info("New Node Created"))

    .on("queueEnd", async (player, track) => {
      let queueEnd = await this.client.findOrCreateGuild({id: player.guild.id})
      queueEnd.last_playing = track.uri
      queueEnd.save()

      if(queueEnd.notifications){
        let guild_colour = await this.client.findOrCreateGuild({id: player.guild.id}).then(guild => guild.colour)
        player.textChannel.send(new MessageEmbed()
          .setColor(guild_colour)
          .setDescription(`Now playing: ${track.title}`)
        )
      }
    })

    .on("trackStart", async (player, track) => {
        let trackStart = await this.client.findOrCreateGuild({id: player.guild.id})
        trackStart.skip_users = []
        trackStart.save()

        if(trackStart.notifications){
          let guild_colour = trackStart.colour
          player.textChannel.send(new MessageEmbed()
            .setColor(guild_colour)
            .setDescription(`Now playing: ${track.title}`)
          )
        }
      }
    )
  
    .on("trackEnd", async (player, track) => {
      let trackEnd = await this.client.findOrCreateGuild({id: player.guild.id})
      trackEnd.last_playing = track.uri
      trackEnd.save()
    })
  }
}