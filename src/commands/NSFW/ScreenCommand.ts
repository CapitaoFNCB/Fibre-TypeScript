import { Command, Flag } from "discord-akairo";
import { Message, TextChannel, MessageAttachment } from "discord.js";
import puppeteer from "puppeteer";
import fetch from "node-fetch";
export default class ScreenCommand extends Command {
  public constructor() {
    super("screen", {
      aliases: ["screen"],
      category: "NSFW",
      channel: "guild",
      typing: true,
      args: [
          {
              id: "website",
              type: async (message: Message, website: string) => {
                if(!(message.channel as TextChannel).nsfw && !this.client.ownerID.includes(message.author.id)) return "This channel is not nsfw";
                if(website) {
                  try {
                    let data = await fetch(website)
                    if(data.status == 200) return website
                  } catch {}
                  return Flag.fail(website)
                }
              },
              prompt: {
                start: "What website would you like to search for?",
                retry: "Invalid website url, please try again."
              }
          }
      ],
      description: {
        content: "Takes a screenshot of the url request.",
        usage: "screen [ url ]",
        examples: ["screen https://example.com/"]
      },
    });
  }

  public async exec(message: Message, { website }: { website: string }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(website == "This channel is not nsfw") return message.util!.send(new this.client.Embed(message, colour).setDescription(`You cannot use the command: \`Screen\` due to its an NSFW command`))
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(website)
    await page.screenshot();
    await browser.close();
    let buffer = await page._screenshotTaskQueue._chain
    let image = new MessageAttachment(buffer, "website.png")
    return message.util!.send(image)
  }
}