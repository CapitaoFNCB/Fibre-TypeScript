import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";
const fs = require('fs').promises;
import fetch from "node-fetch";
import { exec } from "child_process";
import { zip } from 'zip-a-folder';
let remove = require('fs');

export default class AvatarCommand extends Command {
  constructor() {
    super("serveremotes", {
      aliases: ["serveremotes", "se", "emotes"],
      category: "Info",
      channel: "guild",
      typing: true,
      userPermissions: ["MANAGE_GUILD"],
      description: {
        content: "Display's all of the server's emojis.", 
        usage: "serveremotes",
        examples: [
          "serveremotes",
          "se",
          "emotes"
        ]
      },
    });
  }

  async exec(message: Message): Promise<Message | any> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(!message.guild!.emojis.cache.size) return message.util!.send(new this.client.Embed(message, colour).setDescription("This server doesn't have any emojis"))
    exec(`mkdir serveremotes/${message.guild!.id}`);
    for(let emoji of message.guild!.emojis.cache.values()) {
      let data = await fetch(`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif":"png"}?v=1`).then(res => res.buffer())
      await fs.writeFile(`serveremotes/${message.guild!.id}/${emoji.name}.${emoji.animated ? "gif":"png"}`, data).catch(err => console.log(err));
    };
    await zip(`serveremotes/${message.guild!.id}`, `serveremotes/${message.guild!.id}.zip`);
    message.util!.send("", { files: [ `serveremotes/${message.guild!.id}.zip` ] });
    setTimeout(() => {
      fs.unlink(`serveremotes/${message.guild!.id}.zip`, function (err) {
        if (err) console.log(err)
      })
      let dir = remove.readdirSync(`serveremotes/${message.guild!.id}`)
      for(let file of dir){
        remove.unlinkSync(`serveremotes/${message.guild!.id}/${file}`);
      }
      remove.rmdirSync(`serveremotes/${message.guild!.id}`)
    }, 2000)
  }
}