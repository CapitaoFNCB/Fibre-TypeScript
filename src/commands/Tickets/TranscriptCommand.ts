import { Command } from "discord-akairo";
import { Message, Collection } from "discord.js";
const fs = require('fs').promises;
import jsdom from 'jsdom';
import moment from "moment";
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;

export default class TranscriptCommand extends Command {
  public constructor() {
    super("transcript", {
      aliases: ["transcript"],
      channel: "guild",
      category: "Ticket",
      description: {
        content: "Transcript Command",
        usage: "transcript",
        examples: ["transcript"]
      },
      typing: true
    });
  }

  public async exec(message: Message) {

    const channel = message.guild!.channels.cache.get(message.channel!.id)

    if(!channel!.name.startsWith("ticket-")) return message.util!.send(new this.client.Embed()
      .setDescription("This command can used for Tickets")
    )

    let channelMessages = await (await message.channel.messages.cache.filter(x => !x.author.bot))

    let msgs = channelMessages.array().reverse();

    let data = await fs.readFile('./template.html', 'utf8').catch(err => console.log(err));

    await fs.writeFile(`transcripts/${channel!.name}.html`, data).catch(err => console.log(err));


    msgs.forEach(async msg => {

      let parentContainer = document.createElement("div");
      parentContainer.className = "parent-container";
      let avatarDiv = document.createElement("div");
      avatarDiv.className = "avatar-container";
      let img = document.createElement('img');
      img.setAttribute('src', msg.author.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));
      img.className = "avatar";
      avatarDiv.appendChild(img);
      parentContainer.appendChild(avatarDiv);
      let messageContainer = document.createElement('div');
      messageContainer.className = "message-container";
      let nameElement = document.createElement("span");
      moment.locale()
      let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toLocaleString('en-GB', { timeZone: 'UTC' }) + " UTC");
      nameElement.appendChild(name);
      messageContainer.append(nameElement);

      if(msg.content.startsWith("```")) {
        let m = msg.content.replace(/```/g, "");
        let codeNode = document.createElement("code");
        let textNode =  document.createTextNode(m);
        codeNode.appendChild(textNode);
        messageContainer.appendChild(codeNode);
    }
    else {
        let msgNode = document.createElement('span');
        let textNode = document.createTextNode(msg.content.length == 0 ? "Attachment Or Embed" : msg.content);
        msgNode.append(textNode);
        messageContainer.appendChild(msgNode);
    }
    parentContainer.appendChild(messageContainer);
    await fs.appendFile(`transcripts/${channel!.name}.html`, parentContainer.outerHTML).catch(err => console.log(err));

    })


    message.util!.send("", {
      files: [
        `transcripts/${channel!.name}.html`
      ]
    })

    setTimeout(() => {
      fs.unlink(`transcripts/${channel!.name}.html`, function (err) {
        if (err) console.log(err)
      })
    }, 100)

  }
}
