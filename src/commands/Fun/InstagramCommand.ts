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
      channel: "guild",
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
        content: "Shows instagram profile.",
        usage: "instagram [] username ]",
        examples: [
          "instagram gucci",
          "instagram menudocs"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message, { string }: { string: string }): Promise<Message> {
    const search = await api.instagram(string)

    if(!search.success) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setDescription("No Account with this name")
    )

    const result = await fetch(search.user.profile_pic_url);
    const avatar = await result.buffer();

    const buffer = await profile(search);
    const attachment = new MessageAttachment(buffer.toBuffer(), "profile.png");
    return message.util!.send(attachment)

    async function profile(search: any){
        let canvas = new Canvas(900,600)

            .setColor("#ffffff")
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

          if(search.images[0] && !search.user.is_private){
            const firstpic = await fetch(search.images[0].url);
            const first = await firstpic.buffer();
            canvas.addImage(first,0,400, 300, 300)
          }

          if(search.images[1] && !search.user.is_private){
              const secondpic = await fetch(search.images[1].url);
              const second = await secondpic.buffer();
              canvas.addImage(second,300,400, 300, 300)
          }

          if(search.images[2] && !search.user.is_private){
            const thirdpic = await fetch(search.images[2].url);
            const third = await thirdpic.buffer();
            canvas.addImage(third,600,400, 300, 300)
          }

          if(search.user.is_private){
            canvas.setTextAlign("center")
            .setTextFont('25px sans-serif')
            .addText("This Account is Private", 450,500)
            const lock = await fetch(`https://cdn.clipart.email/8e8d1dc05675a503a0cf4a89b570756c_png-file-svg-lock-to-trace-clip-art-library_920-1060.jpeg`);
            const locking = await lock.buffer();
            canvas.addImage(locking,450,420, 50, 50)
          } 

        return canvas
    }
  }
}