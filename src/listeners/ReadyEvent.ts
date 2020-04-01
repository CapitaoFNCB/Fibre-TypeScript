  
import { Listener } from "discord-akairo";
import chalk from "chalk"
import { ErelaClient } from "erela.js"
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


    this.client.music = new ErelaClient(this.client, nodes)
    .on("nodeConnect", node => this.client.logger.info(`New node connected`))
    .on("trackStart", (player, track) => player.textChannel.send(`Now playing: ${track.title}`))
    .on("queueEnd", (player, track) => {
      console.log(track)
    })
    .on("trackEnd", async (player, track) => {

    })
  }
}