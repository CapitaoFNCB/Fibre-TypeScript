import { Listener } from "discord-akairo";
import chalk from "chalk"
import { ErelaClient, Player } from "erela.js"
import { nodes, connection } from "../utils/Config"
import mongoose from "mongoose";

export default class ReadyListener extends Listener {
  public constructor() {
    super("listeners-ready", {
      emitter: "client",
      event: "ready"
    });
  }

  public exec() {
    
    this.client.user?.setStatus("dnd");
    this.client.logger.info(`Started!`);
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

    let guildData;
    this.client.manager = new ErelaClient(this.client, nodes)
    .on("nodeConnect", node => this.client.logger.info("New Node Created"))

    .on("queueEnd", async (player, track) => {
      guildData = await this.client.findOrCreateGuild({ id: player.guild.id });
      guildData.last_playing = track.uri
      guildData.save()

      if(guildData.notifications){
        player.textChannel.send(new this.client.Embed(null, await this.client.guildsData.findOne({ id: player.guild!.id }).then(guild => guild.colour))
          .setDescription("Queue Has Ended")
        )
      }
    })

    .on("trackStart", async (player, track) => {
        guildData = await this.client.findOrCreateGuild({ id: player.guild.id });
        guildData.skip_users = []
        guildData.save()

        if(guildData.notifications){
          player.textChannel.send(new this.client.Embed(null, await this.client.guildsData.findOne({ id: player.guild!.id }).then(guild => guild.colour))
            .setDescription(`Now playing: ${track.title}`)
          )
        }
      }
    )
  

    .on("trackEnd", async (player, track) => {
      guildData = await this.client.findOrCreateGuild({ id: player.guild.id });
      guildData.last_playing = track.uri
      guildData.save()
    })
  }
}