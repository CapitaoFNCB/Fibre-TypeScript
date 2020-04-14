import { Command } from "discord-akairo";
import { Message, MessageAttachment } from "discord.js";
import { DuncateApi } from "duncans-api-wrapper";
import fetch from "node-fetch";
import { Canvas } from "canvas-constructor";
const api = new DuncateApi()

export default class InstagramCommand extends Command {
  public constructor() {
    super("instagram", {
      aliases: ["instagram"],
      category: "Fun",
      args: [
        {
          id: "string",
          type: "string",
          match: "rest",
          prompt:{
            start: "Who would you like to search for?"
          }
        }
      ],
      description: {
        content: "Instagram Command",
        usage: "instagram <username>",
        examples: ["instagram gucci"]
      },
      typing: true
    });
  }

  public async exec(message: Message, {string}: {string: string}) {
    const search = await api.instagram(string)

    if(!search.success) return message.util!.send(new this.client.Embed()
      .setDescription("No Account with this name")
    )

    const result = await fetch(search.user.profile_pic_url);
    const avatar = await result.buffer();

    const firstpic = await fetch(search.images[0].url);
    const first = await firstpic.buffer();

    const secondpic = await fetch(search.images[1].url);
    const second = await secondpic.buffer();

    const thirdpic = await fetch(search.images[2].url);
    const third = await thirdpic.buffer();

    const buffer = await profile(search);
    const attachment = new MessageAttachment(buffer.toBuffer(), "profile.png");
    message.util!.send(attachment)

    async function profile(search: any){
        let canvas = new Canvas(900,600)

            .setColor("#cccccc")
            .addBeveledRect(0,0,900,600)
            .setShadowColor('rgba(22, 22, 22, 1)')
            .setShadowOffsetY(5)
            .setShadowBlur(10) 
            .addCircle(130, 130, 100)
            .addCircularImage(avatar,130,130,100)
            .setTextAlign("center")
            .setColor("#353535")
            .setShadowOffsetY(0)
            .setShadowBlur(0) 
            .setTextFont('32px sans-serif')
            .addText(search.user.full_name, 450, 50)
            .setTextFont('25px sans-serif')
            .addText(search.user.uploads.count.toLocaleString(), 400, 125)
            .addText("Uploads", 400, 175)
            .addText(search.user.followers.count.toLocaleString(), 600, 125)
            .addText("Followers", 600, 175)
            .addText(search.user.following.count.toLocaleString(), 800, 125)
            .addText("Following", 800, 175)
            .setTextAlign("left")
            .setTextFont('18px sans-serif')
            .addText(search.user.biography, 20, 270)
            .addImage(first,0,400, 300, 300)
            .addImage(second,300,400, 300, 300)
            .addImage(third,600,400, 300, 300)


        return canvas
    }
  }
}