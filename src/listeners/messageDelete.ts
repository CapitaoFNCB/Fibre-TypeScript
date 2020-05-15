import { Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class messageDeleteListener extends Listener {
  public constructor() {
    super("messageDelete", {
      emitter: "client",
      event: "messageDelete"
    });
  }

  public async exec(message: Message) {
    if(message.author.bot) return;
    let channel_snipes = this.client.snipes.get(message.channel.id)
    if(!channel_snipes) channel_snipes = this.client.snipes.set(message.channel.id, [])
    channel_snipes = this.client.snipes.get(message.channel.id)
    channel_snipes.push({
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first()!.proxyURL : null
    })
    this.client.snipes.set(message.channel.id, channel_snipes)
  }
}