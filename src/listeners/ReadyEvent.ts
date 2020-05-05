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

    this.client.manager = new ErelaClient(this.client, nodes)
    .on("nodeConnect", node => this.client.logger.info("New Node Created"))

    .on("queueEnd", async (player, track) => {
      let queueEnd = await this.client.guildsData.findOne({ id: player.guild!.id })
      queueEnd.last_playing = track.uri
      queueEnd.save()

      if(queueEnd.notifications){
        player.textChannel.send(new this.client.Embed(null, await this.client.guildsData.findOne({ id: player.guild!.id }).then(guild => guild.colour))
          .setDescription("Queue Has Ended")
        )
      }
    })

    .on("trackStart", async (player, track) => {
        let trackStart = await this.client.guildsData.findOne({ id: player.guild!.id })
        trackStart.skip_users = []
        trackStart.save()

        if(trackStart.notifications){
          player.textChannel.send(new this.client.Embed(null, await this.client.guildsData.findOne({ id: player.guild!.id }).then(guild => guild.colour))
            .setDescription(`Now playing: ${track.title}`)
          )
        }
      }
    )
  

    .on("trackEnd", async (player, track) => {
      let trackEnd = await this.client.guildsData.findOne({ id: player.guild!.id })
      trackEnd.last_playing = track.uri
      trackEnd.save()
    })
  }
}